import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/profile/username?username=xxx
 * Check if a username is available
 *
 * SECURITY NOTE: This endpoint is vulnerable to username enumeration.
 * An attacker could use it to harvest valid usernames by checking many
 * usernames in sequence. To mitigate:
 *
 * 1. Implement rate limiting (recommended: 10 requests/minute per IP)
 *    - At infrastructure level (Cloudflare Rate Limiting rules)
 *    - Or via middleware with a rate limiter library
 *
 * 2. Consider adding CAPTCHA for repeated requests
 *
 * 3. Add artificial delay (100-300ms) to slow down automated attacks
 *
 * Since this app deploys to Cloudflare Workers, the recommended approach
 * is to configure Cloudflare Rate Limiting rules for this endpoint path.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    // Validate username format
    if (username.length < 3) {
      return NextResponse.json({
        available: false,
        reason: 'Username must be at least 3 characters',
      });
    }

    if (username.length > 20) {
      return NextResponse.json({
        available: false,
        reason: 'Username must be 20 characters or less',
      });
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return NextResponse.json({
        available: false,
        reason: 'Username can only contain letters, numbers, and underscores',
      });
    }

    const supabase = await createClient();

    // Check if username is taken (case-insensitive)
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .ilike('username', username)
      .single();

    return NextResponse.json({
      available: !existingUser,
      reason: existingUser ? 'Username is already taken' : null,
    });
  } catch (error) {
    console.error('Error checking username:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
