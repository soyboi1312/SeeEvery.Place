import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { sendEmail, generateConfirmationLink, generateToken } from '@/lib/email';

// POST /api/newsletter/subscribe - Public newsletter signup
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.email || !body.email.trim()) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const email = body.email.toLowerCase().trim();
    const name = body.name?.trim() || null;

    const adminClient = createAdminClient();

    // Check if already exists
    const { data: existing } = await adminClient
      .from('newsletter_subscribers')
      .select('id, is_active, confirmed_at')
      .eq('email', email)
      .single();

    if (existing) {
      if (existing.is_active && existing.confirmed_at) {
        return NextResponse.json({
          success: true,
          message: 'You\'re already subscribed to our newsletter!',
          already_subscribed: true,
        });
      }

      if (existing.is_active && !existing.confirmed_at) {
        // Resend confirmation email
        const token = generateToken();
        await adminClient
          .from('newsletter_subscribers')
          .update({ confirmation_token: token })
          .eq('id', existing.id);

        const confirmLink = generateConfirmationLink(email, token);
        await sendConfirmationEmail(email, name, confirmLink);

        return NextResponse.json({
          success: true,
          message: 'We\'ve sent another confirmation email. Please check your inbox!',
          pending_confirmation: true,
        });
      }

      // Reactivate unsubscribed user
      const token = generateToken();
      await adminClient
        .from('newsletter_subscribers')
        .update({
          is_active: true,
          name,
          unsubscribed_at: null,
          unsubscribe_reason: null,
          confirmation_token: token,
          confirmed_at: null,
        })
        .eq('id', existing.id);

      const confirmLink = generateConfirmationLink(email, token);
      await sendConfirmationEmail(email, name, confirmLink);

      return NextResponse.json({
        success: true,
        message: 'Welcome back! Please check your email to confirm your subscription.',
        reactivated: true,
      });
    }

    // Create new subscriber
    const token = generateToken();
    const { error: insertError } = await adminClient
      .from('newsletter_subscribers')
      .insert({
        email,
        name,
        source: 'website',
        is_active: true,
        confirmation_token: token,
      });

    if (insertError) {
      console.error('Error creating subscriber:', insertError);
      return NextResponse.json({ error: 'Failed to subscribe. Please try again.' }, { status: 500 });
    }

    // Send confirmation email
    const confirmLink = generateConfirmationLink(email, token);
    await sendConfirmationEmail(email, name, confirmLink);

    return NextResponse.json({
      success: true,
      message: 'Thanks for subscribing! Please check your email to confirm your subscription.',
    });
  } catch (error) {
    console.error('Newsletter subscribe error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function sendConfirmationEmail(email: string, name: string | null, confirmLink: string) {
  const greeting = name ? `Hi ${name}!` : 'Hi there!';

  await sendEmail({
    to: email,
    subject: 'Confirm your SeeEvery.Place newsletter subscription',
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <div style="background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%); padding: 24px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">
        SeeEvery<span style="color: #fbbf24;">.</span>Place
      </h1>
    </div>
    <div style="padding: 32px 24px;">
      <p style="font-size: 18px; margin-bottom: 16px;">${greeting}</p>
      <p>Thanks for signing up for the SeeEvery.Place newsletter! We'll send you updates about:</p>
      <ul style="margin: 16px 0; padding-left: 20px;">
        <li>Most visited destinations and hidden gems</li>
        <li>Travel inspiration and bucket list ideas</li>
        <li>New features and categories</li>
        <li>Community highlights</li>
      </ul>
      <p>Please confirm your email address to start receiving our newsletter:</p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${confirmLink}" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
          Confirm Subscription
        </a>
      </div>
      <p style="color: #6b7280; font-size: 14px;">
        If you didn't sign up for this newsletter, you can safely ignore this email.
      </p>
      <p style="color: #6b7280; font-size: 12px; margin-top: 24px;">
        Button not working? Copy and paste this link into your browser:<br>
        <a href="${confirmLink}" style="color: #2563eb; word-break: break-all;">${confirmLink}</a>
      </p>
    </div>
    <div style="background-color: #f9fafb; padding: 24px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb;">
      <p>&copy; ${new Date().getFullYear()} SeeEvery.Place. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `,
    text: `${greeting}\n\nThanks for signing up for the SeeEvery.Place newsletter!\n\nPlease confirm your email address by visiting:\n${confirmLink}\n\nIf you didn't sign up for this newsletter, you can safely ignore this email.`,
  });
}
