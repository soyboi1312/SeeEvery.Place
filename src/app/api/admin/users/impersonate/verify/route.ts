import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

// Secret for verifying impersonation tokens
const getImpersonationSecret = () => {
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret) throw new Error('Missing service role key');
  return new TextEncoder().encode(secret);
};

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
    const token = request.nextUrl.searchParams.get('token');

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

    // Set the session cookies
    const cookieStore = await cookies();
    const { access_token, refresh_token } = sessionData.session;

    // Set Supabase auth cookies
    // The cookie names follow Supabase's convention
    const projectRef = process.env.NEXT_PUBLIC_SUPABASE_URL?.match(/https:\/\/([^.]+)/)?.[1] || 'supabase';

    cookieStore.set(`sb-${projectRef}-auth-token`, JSON.stringify({
      access_token,
      refresh_token,
      expires_at: sessionData.session.expires_at,
      expires_in: sessionData.session.expires_in,
      token_type: 'bearer',
      user: sessionData.session.user,
    }), {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

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
    return NextResponse.redirect(`${siteUrl}/?impersonated=true`);
  } catch (error) {
    console.error('Impersonation verification error:', error);
    return NextResponse.redirect(`${siteUrl}/auth/auth-code-error`);
  }
}
