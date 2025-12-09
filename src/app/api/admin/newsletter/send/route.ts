import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { sendEmail, wrapInEmailTemplate, generateUnsubscribeLink, generateToken } from '@/lib/email';

// Helper to verify admin status
async function verifyAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Unauthorized', status: 401, user: null, email: null };
  }

  const { data: adminCheck } = await supabase
    .from('admin_emails')
    .select('email')
    .eq('email', user.email?.toLowerCase())
    .single();

  if (!adminCheck) {
    return { error: 'Forbidden', status: 403, user: null, email: null };
  }

  return { error: null, status: 200, user, email: user.email };
}

// Helper to log admin actions
async function logAdminAction(
  adminEmail: string,
  action: string,
  targetType: string,
  targetId: string,
  details?: Record<string, unknown>,
  ipAddress?: string
) {
  try {
    const adminClient = createAdminClient();
    await adminClient.from('admin_logs').insert({
      admin_email: adminEmail,
      action,
      target_type: targetType,
      target_id: targetId,
      details,
      ip_address: ipAddress,
    });
  } catch (error) {
    console.error('Failed to log admin action:', error);
  }
}

// POST /api/admin/newsletter/send - Send a newsletter
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { error, status, email: adminEmail } = await verifyAdmin(supabase);

    if (error || !adminEmail) {
      return NextResponse.json({ error: error || 'Unauthorized' }, { status });
    }

    const { newsletter_id, test_email } = await request.json();

    if (!newsletter_id) {
      return NextResponse.json({ error: 'Newsletter ID is required' }, { status: 400 });
    }

    const adminClient = createAdminClient();

    // Get the newsletter
    const { data: newsletter, error: fetchError } = await adminClient
      .from('newsletters')
      .select('*')
      .eq('id', newsletter_id)
      .single();

    if (fetchError || !newsletter) {
      return NextResponse.json({ error: 'Newsletter not found' }, { status: 404 });
    }

    if (newsletter.status === 'sent' || newsletter.status === 'sending') {
      return NextResponse.json({ error: 'Newsletter has already been sent or is being sent' }, { status: 400 });
    }

    // If test_email is provided, send only to that email
    if (test_email) {
      const unsubscribeLink = generateUnsubscribeLink(test_email, 'test-token');
      const htmlContent = wrapInEmailTemplate(newsletter.content_html, unsubscribeLink);

      const result = await sendEmail({
        to: test_email,
        subject: `[TEST] ${newsletter.subject}`,
        html: htmlContent,
        text: newsletter.content_text || undefined,
        tags: [
          { name: 'newsletter_id', value: newsletter_id },
          { name: 'type', value: 'test' },
        ],
      });

      if (!result.success) {
        return NextResponse.json({ error: `Failed to send test email: ${result.error}` }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: `Test email sent to ${test_email}`,
        resend_id: result.id,
      });
    }

    // Get all active, confirmed subscribers
    const { data: subscribers, error: subError } = await adminClient
      .from('newsletter_subscribers')
      .select('id, email, name')
      .eq('is_active', true)
      .not('confirmed_at', 'is', null);

    if (subError) {
      console.error('Error fetching subscribers:', subError);
      return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 });
    }

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({ error: 'No active subscribers to send to' }, { status: 400 });
    }

    // Update newsletter status to sending
    await adminClient
      .from('newsletters')
      .update({ status: 'sending' })
      .eq('id', newsletter_id);

    // Send emails (in batches to avoid rate limits)
    let successCount = 0;
    let failCount = 0;

    for (const subscriber of subscribers) {
      try {
        // Generate or get unsubscribe token
        let unsubscribeToken = '';
        const { data: subData } = await adminClient
          .from('newsletter_subscribers')
          .select('confirmation_token')
          .eq('id', subscriber.id)
          .single();

        if (subData?.confirmation_token) {
          unsubscribeToken = subData.confirmation_token;
        } else {
          unsubscribeToken = generateToken();
          await adminClient
            .from('newsletter_subscribers')
            .update({ confirmation_token: unsubscribeToken })
            .eq('id', subscriber.id);
        }

        const unsubscribeLink = generateUnsubscribeLink(subscriber.email, unsubscribeToken);
        const htmlContent = wrapInEmailTemplate(newsletter.content_html, unsubscribeLink);

        const result = await sendEmail({
          to: subscriber.email,
          subject: newsletter.subject,
          html: htmlContent,
          text: newsletter.content_text || undefined,
          tags: [
            { name: 'newsletter_id', value: newsletter_id },
            { name: 'subscriber_id', value: subscriber.id },
          ],
        });

        // Log the send
        await adminClient.from('newsletter_send_logs').insert({
          newsletter_id,
          subscriber_id: subscriber.id,
          email: subscriber.email,
          status: result.success ? 'sent' : 'failed',
          resend_id: result.id || null,
          sent_at: result.success ? new Date().toISOString() : null,
          error_message: result.error || null,
        });

        if (result.success) {
          successCount++;
        } else {
          failCount++;
        }

        // Small delay to avoid rate limits (100 emails/second for Resend)
        await new Promise(resolve => setTimeout(resolve, 15));
      } catch (err) {
        console.error(`Error sending to ${subscriber.email}:`, err);
        failCount++;

        await adminClient.from('newsletter_send_logs').insert({
          newsletter_id,
          subscriber_id: subscriber.id,
          email: subscriber.email,
          status: 'failed',
          error_message: err instanceof Error ? err.message : 'Unknown error',
        });
      }
    }

    // Update newsletter status
    const finalStatus = failCount === subscribers.length ? 'failed' : 'sent';
    await adminClient
      .from('newsletters')
      .update({
        status: finalStatus,
        sent_at: new Date().toISOString(),
        sent_by: adminEmail,
        recipient_count: successCount,
      })
      .eq('id', newsletter_id);

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    await logAdminAction(adminEmail, 'send_newsletter', 'newsletter', newsletter_id, {
      subject: newsletter.subject,
      success_count: successCount,
      fail_count: failCount,
      total_recipients: subscribers.length,
    }, ip);

    return NextResponse.json({
      success: true,
      message: `Newsletter sent to ${successCount} subscribers`,
      stats: {
        total: subscribers.length,
        success: successCount,
        failed: failCount,
      },
    });
  } catch (error) {
    console.error('Admin newsletter send error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
