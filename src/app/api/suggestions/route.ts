import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { suggestionSchema, toDbFormat } from '@/lib/validations/suggestion';
import crypto from 'crypto';

// Rate limit: max submissions per time window
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

// PERFORMANCE NOTE: Current rate limiting uses Postgres queries. For high-traffic scenarios,
// consider migrating to Cloudflare Rate Limiting (WAF) or Cloudflare KV for faster lookups
// that don't hit the database connection pool. The DB approach is acceptable for low-to-medium
// traffic but could become a bottleneck under DDoS conditions.
// See: https://developers.cloudflare.com/waf/rate-limiting-rules/

/**
 * Hash IP address for privacy compliance (GDPR).
 * Uses a daily salt so the hash rotates, providing additional privacy
 * while still allowing rate limiting within a 24-hour window.
 */
function hashIpAddress(ip: string): string {
  const dailySalt = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  return crypto.createHash('sha256').update(ip + dailySalt).digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    // 1. Rate Limiting Logic
    // Get raw IP from various headers (Cloudflare, proxies, direct)
    const rawIp = request.headers.get('cf-connecting-ip')
      || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || 'unknown';

    // Hash the IP for privacy - we never store raw IPs
    const hashedIp = hashIpAddress(rawIp);

    const supabase = await createClient();
    const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();

    const { count, error: countError } = await supabase
      .from('suggestions')
      .select('*', { count: 'exact', head: true })
      .eq('submitter_ip', hashedIp)
      .gte('created_at', windowStart);

    if (!countError && count !== null && count >= RATE_LIMIT_MAX) {
      return NextResponse.json(
        { error: `Too many submissions. Please wait before submitting again. (Limit: ${RATE_LIMIT_MAX} per hour)` },
        { status: 429 }
      );
    }

    // 2. Parse Body
    const body = await request.json();

    // 3. Validate using Zod Schema
    // We map the snake_case keys from the API request to the camelCase keys expected by the Zod schema
    // Convert null values to undefined since Zod's .optional() accepts undefined but not null
    const validation = suggestionSchema.safeParse({
        title: body.title,
        description: body.description ?? undefined,
        examplePlaces: body.example_places ?? undefined,
        dataSource: body.data_source ?? undefined,
        email: body.submitter_email ?? undefined
    });

    if (!validation.success) {
      // Return the first error message from Zod
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    // 4. Transform to DB format
    const dbData = toDbFormat(validation.data);

    // 5. Insert with hashed IP (never store raw IPs)
    const { data, error } = await supabase
      .from('suggestions')
      .insert({
        ...dbData,
        submitter_ip: hashedIp,
      })
      .select()
      .single();

    if (error) {
      console.error('Suggestion insert error:', error);
      return NextResponse.json(
        { error: 'Failed to submit suggestion' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, suggestion: data });

  } catch (error) {
    console.error('Suggestion submission error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
