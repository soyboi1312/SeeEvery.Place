import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { SignJWT } from 'jose';
import { getClientIP } from '@/lib/serverUtils';

// Secret for signing impersonation tokens - in production, use a proper secret management
const getImpersonationSecret = () => {
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret) throw new Error('Missing service role key');
  return new TextEncoder().encode(secret);
};

// Impersonate user - generate a secure token for impersonation
export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId || typeof userId !== 'string') {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Verify admin access
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const { data: adminCheck } = await supabase
      .from('admin_emails')
      .select('email, role')
      .eq('email', user.email?.toLowerCase())
      .single();

    if (!adminCheck) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Prevent impersonating yourself
    if (user.id === userId) {
      return NextResponse.json({ error: 'Cannot impersonate yourself' }, { status: 400 });
    }

    const adminClient = createAdminClient();

    // Get target user info
    const { data: targetUser, error: userError } = await adminClient.auth.admin.getUserById(userId);

    if (userError || !targetUser?.user) {
      console.error('Error fetching target user:', userError);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prevent impersonating another admin (unless you're super_admin)
    if (targetUser.user.email) {
      const { data: targetIsAdmin } = await adminClient
        .from('admin_emails')
        .select('email, role')
        .eq('email', targetUser.user.email.toLowerCase())
        .single();

      if (targetIsAdmin && adminCheck.role !== 'super_admin') {
        return NextResponse.json({ error: 'Cannot impersonate another admin' }, { status: 400 });
      }
    }

    // Generate a short-lived JWT token for impersonation
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const token = await new SignJWT({
      targetUserId: userId,
      targetEmail: targetUser.user.email,
      adminEmail: user.email,
      adminId: user.id,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('5m') // Token expires in 5 minutes
      .sign(getImpersonationSecret());

    // Log the impersonation attempt
    const ip = getClientIP(request);
    try {
      await adminClient.from('admin_logs').insert({
        admin_email: user.email,
        action: 'impersonate_user',
        target_type: 'user',
        target_id: userId,
        details: {
          target_email: targetUser.user.email,
          impersonator: user.email,
        },
        ip_address: ip,
      });
    } catch (logErr) {
      console.error('Failed to log admin action:', logErr);
    }

    return NextResponse.json({
      success: true,
      link: `${siteUrl}/api/admin/users/impersonate/verify?token=${token}`,
      email: targetUser.user.email,
    });
  } catch (error) {
    console.error('Impersonation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
