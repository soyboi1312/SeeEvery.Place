import { Resend } from 'resend';

// Lazy initialize Resend client to avoid build-time errors
let resendClient: Resend | null = null;

function getResend(): Resend {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY environment variable is not set');
    }
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  tags?: { name: string; value: string }[];
}

export interface SendEmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

// Send a single email
export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  try {
    const resend = getResend();
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'SeeEvery.Place <newsletter@seeevery.place>',
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      replyTo: options.replyTo || 'hello@seeevery.place',
      tags: options.tags,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (err) {
    console.error('Email send error:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error'
    };
  }
}

// Send batch emails (for newsletters)
export async function sendBatchEmails(
  emails: Array<{
    to: string;
    subject: string;
    html: string;
    text?: string;
    tags?: { name: string; value: string }[];
  }>
): Promise<{ success: boolean; results: SendEmailResult[] }> {
  const resend = getResend();
  const results: SendEmailResult[] = [];

  // Resend batch API allows up to 100 emails per request
  const batchSize = 100;

  for (let i = 0; i < emails.length; i += batchSize) {
    const batch = emails.slice(i, i + batchSize);

    try {
      const { data, error } = await resend.batch.send(
        batch.map(email => ({
          from: process.env.RESEND_FROM_EMAIL || 'SeeEvery.Place <newsletter@seeevery.place>',
          to: email.to,
          subject: email.subject,
          html: email.html,
          text: email.text,
          tags: email.tags,
        }))
      );

      if (error) {
        // If batch fails, mark all as failed
        batch.forEach(() => {
          results.push({ success: false, error: error.message });
        });
      } else if (data) {
        // Map results to individual emails
        data.data.forEach((result) => {
          results.push({ success: true, id: result.id });
        });
      }
    } catch (err) {
      batch.forEach(() => {
        results.push({
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error'
        });
      });
    }
  }

  return {
    success: results.every(r => r.success),
    results,
  };
}

// Generate unsubscribe link
export function generateUnsubscribeLink(email: string, token: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://seeevery.place';
  return `${baseUrl}/newsletter/unsubscribe?email=${encodeURIComponent(email)}&token=${token}`;
}

// Generate confirmation link for double opt-in
export function generateConfirmationLink(email: string, token: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://seeevery.place';
  return `${baseUrl}/newsletter/confirm?email=${encodeURIComponent(email)}&token=${token}`;
}

// Newsletter email template wrapper
export function wrapInEmailTemplate(content: string, unsubscribeLink: string): string {
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
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
      padding: 24px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 24px;
      font-weight: bold;
    }
    .header span {
      color: #fbbf24;
    }
    .content {
      padding: 32px 24px;
    }
    .footer {
      background-color: #f9fafb;
      padding: 24px;
      text-align: center;
      font-size: 12px;
      color: #6b7280;
      border-top: 1px solid #e5e7eb;
    }
    .footer a {
      color: #2563eb;
      text-decoration: none;
    }
    .footer a:hover {
      text-decoration: underline;
    }
    .place-card {
      background-color: #f9fafb;
      border-radius: 8px;
      padding: 16px;
      margin: 16px 0;
      border-left: 4px solid #2563eb;
    }
    .place-card h3 {
      margin: 0 0 8px 0;
      color: #1f2937;
    }
    .place-card p {
      margin: 0;
      color: #6b7280;
      font-size: 14px;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      margin: 16px 0;
    }
    .stat-card {
      background-color: #eff6ff;
      border-radius: 8px;
      padding: 12px;
      text-align: center;
    }
    .stat-value {
      font-size: 24px;
      font-weight: bold;
      color: #2563eb;
    }
    .stat-label {
      font-size: 12px;
      color: #6b7280;
    }
    .button {
      display: inline-block;
      background-color: #2563eb;
      color: #ffffff !important;
      padding: 12px 24px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 500;
      margin: 8px 0;
    }
    .button:hover {
      background-color: #1d4ed8;
    }
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

// Generate crypto-safe token
export function generateToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
