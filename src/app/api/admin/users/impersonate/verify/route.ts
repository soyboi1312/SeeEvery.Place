import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient, createClient } from '@/lib/supabase/server';
import { jwtVerify } from 'jose';

// Secret for verifying impersonation tokens
const getImpersonationSecret = () => {
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret) throw new Error('Missing service role key');
  return new TextEncoder().encode(secret);
};

// Cookie name for impersonation token (must match route.ts)
const IMPERSONATION_COOKIE = 'impersonation_token';

interface ImpersonationPayload {
  targetUserId: string;
  targetEmail: string;
  adminEmail: string;
  adminId: string;
}

// Verify impersonation token and create session
export async function GET(request: NextRequest) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  try {
    // Read token from httpOnly cookie instead of URL params
    // This prevents token exposure in browser history, logs, and referrer headers
    const token = request.cookies.get(IMPERSONATION_COOKIE)?.value;

    if (!token) {
      return NextResponse.redirect(`${siteUrl}/auth/auth-code-error`);
    }

    // Verify the JWT token
    let payload: ImpersonationPayload;
    try {
      const { payload: verified } = await jwtVerify(token, getImpersonationSecret());
      payload = verified as unknown as ImpersonationPayload;
    } catch (err) {
      console.error('Invalid impersonation token:', err);
      return NextResponse.redirect(`${siteUrl}/auth/auth-code-error`);
    }

    const { targetUserId, targetEmail, adminEmail } = payload;

    if (!targetUserId || !targetEmail) {
      return NextResponse.redirect(`${siteUrl}/auth/auth-code-error`);
    }

    const adminClient = createAdminClient();

    // Verify the target user still exists
    const { data: targetUser, error: userError } = await adminClient.auth.admin.getUserById(targetUserId);

    if (userError || !targetUser?.user) {
      console.error('Target user not found:', userError);
      return NextResponse.redirect(`${siteUrl}/auth/auth-code-error`);
    }

    // Generate a new magic link and extract the token to verify it server-side
    // This creates a valid session for the target user
    const { data: linkData, error: linkError } = await adminClient.auth.admin.generateLink({
      type: 'magiclink',
      email: targetEmail,
    });

    if (linkError || !linkData?.properties?.hashed_token) {
      console.error('Failed to generate session link:', linkError);
      return NextResponse.redirect(`${siteUrl}/auth/auth-code-error`);
    }

    // Use the OTP from the generated link to verify and create a session
    // The admin-generated link gives us an email_otp we can verify directly
    const { data: sessionData, error: sessionError } = await adminClient.auth.verifyOtp({
      email: targetEmail,
      token: linkData.properties.email_otp,
      type: 'email',
    });

    if (sessionError || !sessionData?.session) {
      console.error('Failed to create session:', sessionError);
      return NextResponse.redirect(`${siteUrl}/auth/auth-code-error`);
    }

    // Use the SSR client to properly set session cookies
    // This ensures cookies are named correctly, chunked if necessary, and secure
    const supabase = await createClient();

    const { error: setSessionError } = await supabase.auth.setSession({
      access_token: sessionData.session.access_token,
      refresh_token: sessionData.session.refresh_token,
    });

    if (setSessionError) {
      console.error('Failed to set session cookie:', setSessionError);
      return NextResponse.redirect(`${siteUrl}/auth/auth-code-error`);
    }

    // Log successful impersonation
    try {
      await adminClient.from('admin_logs').insert({
        admin_email: adminEmail,
        action: 'impersonate_user_success',
        target_type: 'user',
        target_id: targetUserId,
        details: {
          target_email: targetEmail,
        },
        ip_address: request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown',
      });
    } catch (logErr) {
      console.error('Failed to log impersonation success:', logErr);
    }

    // Redirect to home page with impersonation flag
    // Clear the impersonation cookie after successful use
    const response = NextResponse.redirect(`${siteUrl}/?impersonated=true`);
    response.cookies.delete(IMPERSONATION_COOKIE);
    return response;
  } catch (error) {
    console.error('Impersonation verification error:', error);
    // Clear the cookie on error too
    const response = NextResponse.redirect(`${siteUrl}/auth/auth-code-error`);
    response.cookies.delete(IMPERSONATION_COOKIE);
    return response;
  }
}
