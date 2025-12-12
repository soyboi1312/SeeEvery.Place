import { WorkflowEntrypoint, WorkflowStep, WorkflowEvent } from 'cloudflare:workers';

// Workflow parameters passed when starting the workflow
export interface NewsletterWorkflowParams {
  newsletterId: string;
  adminEmail: string;
  ipAddress: string;
}

// Subscriber data structure
interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  confirmation_token: string | null;
}

// Newsletter data structure
interface Newsletter {
  id: string;
  subject: string;
  content_html: string;
  content_text: string | null;
  status: string;
}

// Environment bindings
export interface Env {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  RESEND_API_KEY: string;
  RESEND_FROM_EMAIL: string;
  NEXT_PUBLIC_SITE_URL: string;
}

// Batch size for sending emails (Resend allows up to 100 per batch)
const BATCH_SIZE = 50;

// Generate unsubscribe link
function generateUnsubscribeLink(baseUrl: string, email: string, token: string): string {
  return `${baseUrl}/newsletter/unsubscribe?email=${encodeURIComponent(email)}&token=${token}`;
}

// Generate crypto-safe token
function generateToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => chars[byte % chars.length]).join('');
}

// Wrap content in email template
function wrapInEmailTemplate(content: string, unsubscribeLink: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SeeEvery.Place Newsletter</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header {
      background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
      padding: 24px;
      text-align: center;
    }
    .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: bold; }
    .header span { color: #fbbf24; }
    .content { padding: 32px 24px; }
    .footer {
      background-color: #f9fafb;
      padding: 24px;
      text-align: center;
      font-size: 12px;
      color: #6b7280;
      border-top: 1px solid #e5e7eb;
    }
    .footer a { color: #2563eb; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>SeeEvery<span>.</span>Place</h1>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>You're receiving this email because you subscribed to the SeeEvery.Place newsletter.</p>
      <p>
        <a href="https://seeevery.place">Visit SeeEvery.Place</a> &bull;
        <a href="${unsubscribeLink}">Unsubscribe</a>
      </p>
      <p>&copy; ${new Date().getFullYear()} SeeEvery.Place. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

// Supabase client for workflows (simple fetch-based)
class SupabaseWorkflowClient {
  private url: string;
  private key: string;

  constructor(url: string, serviceRoleKey: string) {
    this.url = url;
    this.key = serviceRoleKey;
  }

  async query<T>(table: string, options: {
    select?: string;
    eq?: Record<string, string | boolean>;
    not?: { column: string; operator: string; value: unknown };
    single?: boolean;
  }): Promise<{ data: T | null; error: Error | null }> {
    let url = `${this.url}/rest/v1/${table}?`;

    if (options.select) {
      url += `select=${encodeURIComponent(options.select)}&`;
    }

    if (options.eq) {
      for (const [key, value] of Object.entries(options.eq)) {
        url += `${key}=eq.${encodeURIComponent(String(value))}&`;
      }
    }

    if (options.not) {
      url += `${options.not.column}=not.is.${options.not.value}&`;
    }

    try {
      const response = await fetch(url, {
        headers: {
          'apikey': this.key,
          'Authorization': `Bearer ${this.key}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Supabase error: ${response.status}`);
      }

      const data = await response.json();
      return { data: options.single ? data[0] || null : data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  async update(table: string, data: Record<string, unknown>, eq: Record<string, string>): Promise<{ error: Error | null }> {
    let url = `${this.url}/rest/v1/${table}?`;

    for (const [key, value] of Object.entries(eq)) {
      url += `${key}=eq.${encodeURIComponent(value)}&`;
    }

    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'apikey': this.key,
          'Authorization': `Bearer ${this.key}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Supabase update error: ${response.status}`);
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }

  async insert(table: string, data: Record<string, unknown> | Record<string, unknown>[]): Promise<{ error: Error | null }> {
    const url = `${this.url}/rest/v1/${table}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'apikey': this.key,
          'Authorization': `Bearer ${this.key}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Supabase insert error: ${response.status}`);
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }
}

// Resend email sender for workflows
async function sendEmailBatch(
  apiKey: string,
  fromEmail: string,
  emails: Array<{
    to: string;
    subject: string;
    html: string;
    text?: string;
    tags?: { name: string; value: string }[];
  }>
): Promise<Array<{ success: boolean; id?: string; error?: string }>> {
  const results: Array<{ success: boolean; id?: string; error?: string }> = [];

  try {
    const response = await fetch('https://api.resend.com/emails/batch', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        emails.map(email => ({
          from: fromEmail,
          to: email.to,
          subject: email.subject,
          html: email.html,
          text: email.text,
          tags: email.tags,
        }))
      ),
    });

    if (!response.ok) {
      const errorText = await response.text();
      emails.forEach(() => {
        results.push({ success: false, error: `Resend API error: ${response.status} - ${errorText}` });
      });
      return results;
    }

    const data = await response.json();

    if (data.data && Array.isArray(data.data)) {
      data.data.forEach((result: { id: string }) => {
        results.push({ success: true, id: result.id });
      });
    } else {
      emails.forEach(() => {
        results.push({ success: false, error: 'Unexpected response format' });
      });
    }
  } catch (error) {
    emails.forEach(() => {
      results.push({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
    });
  }

  return results;
}

export class SendNewsletterWorkflow extends WorkflowEntrypoint<Env, NewsletterWorkflowParams> {
  async run(event: WorkflowEvent<NewsletterWorkflowParams>, step: WorkflowStep) {
    const { newsletterId, adminEmail, ipAddress } = event.payload;
    const baseUrl = this.env.NEXT_PUBLIC_SITE_URL || 'https://seeevery.place';

    const supabase = new SupabaseWorkflowClient(
      this.env.SUPABASE_URL,
      this.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Step 1: Fetch the newsletter
    const newsletter = await step.do('fetch-newsletter', async () => {
      const { data, error } = await supabase.query<Newsletter>('newsletters', {
        select: '*',
        eq: { id: newsletterId },
        single: true,
      });

      if (error || !data) {
        throw new Error(`Newsletter not found: ${newsletterId}`);
      }

      if (data.status === 'sent' || data.status === 'sending') {
        throw new Error('Newsletter has already been sent or is being sent');
      }

      return data;
    });

    // Step 2: Update status to 'sending'
    await step.do('mark-sending', async () => {
      await supabase.update('newsletters', { status: 'sending' }, { id: newsletterId });
    });

    // Step 3: Fetch all active, confirmed subscribers
    const subscribers = await step.do('fetch-subscribers', async () => {
      const { data, error } = await supabase.query<Subscriber[]>('newsletter_subscribers', {
        select: 'id,email,name,confirmation_token',
        eq: { is_active: true },
        not: { column: 'confirmed_at', operator: 'is', value: null },
      });

      if (error) {
        throw new Error('Failed to fetch subscribers');
      }

      return data || [];
    });

    if (subscribers.length === 0) {
      await step.do('mark-no-subscribers', async () => {
        await supabase.update('newsletters', {
          status: 'failed',
          sent_at: new Date().toISOString(),
          sent_by: adminEmail,
          recipient_count: 0,
        }, { id: newsletterId });
      });
      return { success: false, error: 'No subscribers', stats: { total: 0, success: 0, failed: 0 } };
    }

    // Step 4: Ensure all subscribers have unsubscribe tokens
    const subscribersWithTokens = await step.do('ensure-tokens', async () => {
      const updated: Subscriber[] = [];

      for (const subscriber of subscribers) {
        if (!subscriber.confirmation_token) {
          const token = generateToken();
          await supabase.update(
            'newsletter_subscribers',
            { confirmation_token: token },
            { id: subscriber.id }
          );
          updated.push({ ...subscriber, confirmation_token: token });
        } else {
          updated.push(subscriber);
        }
      }

      return updated;
    });

    // Step 5: Send emails in batches with sleep between batches
    let successCount = 0;
    let failCount = 0;
    const totalBatches = Math.ceil(subscribersWithTokens.length / BATCH_SIZE);

    for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
      const batchStart = batchIndex * BATCH_SIZE;
      const batchEnd = Math.min(batchStart + BATCH_SIZE, subscribersWithTokens.length);
      const batch = subscribersWithTokens.slice(batchStart, batchEnd);

      // Send this batch
      const batchResult = await step.do(`send-batch-${batchIndex}`, async () => {
        const emails = batch.map(subscriber => {
          const unsubscribeLink = generateUnsubscribeLink(
            baseUrl,
            subscriber.email,
            subscriber.confirmation_token!
          );
          const htmlContent = wrapInEmailTemplate(newsletter.content_html, unsubscribeLink);

          return {
            to: subscriber.email,
            subject: newsletter.subject,
            html: htmlContent,
            text: newsletter.content_text || undefined,
            tags: [
              { name: 'newsletter_id', value: newsletterId },
              { name: 'subscriber_id', value: subscriber.id },
            ],
          };
        });

        const results = await sendEmailBatch(
          this.env.RESEND_API_KEY,
          this.env.RESEND_FROM_EMAIL || 'SeeEvery.Place <newsletter@seeevery.place>',
          emails
        );

        // Log results to database
        const logs = batch.map((subscriber, index) => ({
          newsletter_id: newsletterId,
          subscriber_id: subscriber.id,
          email: subscriber.email,
          status: results[index].success ? 'sent' : 'failed',
          resend_id: results[index].id || null,
          sent_at: results[index].success ? new Date().toISOString() : null,
          error_message: results[index].error || null,
        }));

        await supabase.insert('newsletter_send_logs', logs);

        return {
          success: results.filter(r => r.success).length,
          failed: results.filter(r => !r.success).length,
        };
      });

      successCount += batchResult.success;
      failCount += batchResult.failed;

      // Sleep between batches to respect rate limits (except for last batch)
      if (batchIndex < totalBatches - 1) {
        await step.sleep('rate-limit-delay', '1 second');
      }
    }

    // Step 6: Update newsletter status to 'sent'
    await step.do('mark-complete', async () => {
      const finalStatus = failCount === subscribersWithTokens.length ? 'failed' : 'sent';

      await supabase.update('newsletters', {
        status: finalStatus,
        sent_at: new Date().toISOString(),
        sent_by: adminEmail,
        recipient_count: successCount,
      }, { id: newsletterId });

      // Log admin action
      await supabase.insert('admin_logs', {
        admin_email: adminEmail,
        action: 'send_newsletter',
        target_type: 'newsletter',
        target_id: newsletterId,
        details: {
          subject: newsletter.subject,
          success_count: successCount,
          fail_count: failCount,
          total_recipients: subscribersWithTokens.length,
        },
        ip_address: ipAddress,
      });
    });

    return {
      success: true,
      stats: {
        total: subscribersWithTokens.length,
        success: successCount,
        failed: failCount,
      },
    };
  }
}

// Export default for wrangler
export default {
  async fetch(): Promise<Response> {
    return new Response('Newsletter Workflow Worker', { status: 200 });
  },
};
