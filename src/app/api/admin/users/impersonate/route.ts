import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

// Impersonate user - generate a magic link for the admin to log in as the user
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

    // Generate magic link for impersonation
    // Note: This creates a temporary session for the target user
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const { data: magicLink, error: linkError } = await adminClient.auth.admin.generateLink({
      type: 'magiclink',
      email: targetUser.user.email || '',
      options: {
        // Must go through /auth/callback to properly exchange the code for a session
        redirectTo: `${siteUrl}/auth/callback?next=${encodeURIComponent('/?impersonated=true')}`,
      },
    });

    if (linkError || !magicLink?.properties?.action_link) {
      console.error('Error generating magic link:', linkError);
      return NextResponse.json({ error: 'Failed to generate impersonation link' }, { status: 500 });
    }

    // Log the impersonation attempt
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
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
      link: magicLink.properties.action_link,
      email: targetUser.user.email,
    });
  } catch (error) {
    console.error('Impersonation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
