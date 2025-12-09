import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

// GET /api/newsletter/confirm - Confirm email subscription
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
      .select('id, confirmed_at')
      .eq('email', email.toLowerCase())
      .eq('confirmation_token', token)
      .single();

    if (error || !subscriber) {
      return NextResponse.redirect(new URL('/newsletter/error?reason=not_found', request.url));
    }

    if (subscriber.confirmed_at) {
      // Already confirmed
      return NextResponse.redirect(new URL('/newsletter/confirmed?already=true', request.url));
    }

    // Confirm the subscription
    const { error: updateError } = await adminClient
      .from('newsletter_subscribers')
      .update({
        confirmed_at: new Date().toISOString(),
      })
      .eq('id', subscriber.id);

    if (updateError) {
      console.error('Error confirming subscription:', updateError);
      return NextResponse.redirect(new URL('/newsletter/error?reason=failed', request.url));
    }

    return NextResponse.redirect(new URL('/newsletter/confirmed', request.url));
  } catch (error) {
    console.error('Newsletter confirm error:', error);
    return NextResponse.redirect(new URL('/newsletter/error?reason=error', request.url));
  }
}
