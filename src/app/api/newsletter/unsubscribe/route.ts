import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

// GET /api/newsletter/unsubscribe - Unsubscribe from newsletter
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');
    const token = searchParams.get('token');

    if (!email || !token) {
      return NextResponse.redirect(new URL('/newsletter/error?reason=invalid', request.url));
    }

    const adminClient = createAdminClient();

    // Find subscriber with matching email and token
    const { data: subscriber, error } = await adminClient
      .from('newsletter_subscribers')
      .select('id, is_active')
      .eq('email', email.toLowerCase())
      .eq('confirmation_token', token)
      .single();

    if (error || !subscriber) {
      return NextResponse.redirect(new URL('/newsletter/error?reason=not_found', request.url));
    }

    if (!subscriber.is_active) {
      // Already unsubscribed
      return NextResponse.redirect(new URL('/newsletter/unsubscribed?already=true', request.url));
    }

    // Unsubscribe
    const { error: updateError } = await adminClient
      .from('newsletter_subscribers')
      .update({
        is_active: false,
        unsubscribed_at: new Date().toISOString(),
      })
      .eq('id', subscriber.id);

    if (updateError) {
      console.error('Error unsubscribing:', updateError);
      return NextResponse.redirect(new URL('/newsletter/error?reason=failed', request.url));
    }

    return NextResponse.redirect(new URL('/newsletter/unsubscribed', request.url));
  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    return NextResponse.redirect(new URL('/newsletter/error?reason=error', request.url));
  }
}

// POST /api/newsletter/unsubscribe - Unsubscribe with reason
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, token, reason } = body;

    if (!email || !token) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const adminClient = createAdminClient();

    const { data: subscriber, error } = await adminClient
      .from('newsletter_subscribers')
      .select('id, is_active')
      .eq('email', email.toLowerCase())
      .eq('confirmation_token', token)
      .single();

    if (error || !subscriber) {
      return NextResponse.json({ error: 'Subscriber not found' }, { status: 404 });
    }

    if (!subscriber.is_active) {
      return NextResponse.json({ success: true, message: 'Already unsubscribed' });
    }

    const { error: updateError } = await adminClient
      .from('newsletter_subscribers')
      .update({
        is_active: false,
        unsubscribed_at: new Date().toISOString(),
        unsubscribe_reason: reason || null,
      })
      .eq('id', subscriber.id);

    if (updateError) {
      return NextResponse.json({ error: 'Failed to unsubscribe' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Successfully unsubscribed' });
  } catch (error) {
    console.error('Newsletter unsubscribe POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
