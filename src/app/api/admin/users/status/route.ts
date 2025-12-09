import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

// Update user status (suspend/ban/activate)
export async function PUT(request: NextRequest) {
  try {
    const { userId, status, reason, until } = await request.json();

    if (!userId || typeof userId !== 'string') {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    if (!status || !['active', 'suspended', 'banned'].includes(status)) {
      return NextResponse.json({ error: 'Valid status is required (active, suspended, banned)' }, { status: 400 });
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
      .select('email')
      .eq('email', user.email?.toLowerCase())
      .single();

    if (!adminCheck) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Prevent suspending yourself
    if (user.id === userId) {
      return NextResponse.json({ error: 'Cannot modify your own status' }, { status: 400 });
    }

    const adminClient = createAdminClient();

    // Check if target user is an admin - prevent suspending admins
    const { data: targetUser } = await adminClient.auth.admin.getUserById(userId);
    if (targetUser?.user?.email) {
      const { data: targetIsAdmin } = await adminClient
        .from('admin_emails')
        .select('email')
        .eq('email', targetUser.user.email.toLowerCase())
        .single();

      if (targetIsAdmin) {
        return NextResponse.json({ error: 'Cannot modify status of another admin' }, { status: 400 });
      }
    }

    // Upsert user status
    const statusData = {
      id: userId,
      status,
      suspended_at: status !== 'active' ? new Date().toISOString() : null,
      suspended_by: status !== 'active' ? user.email : null,
      suspend_reason: status !== 'active' ? (reason || null) : null,
      suspended_until: status !== 'active' && until ? new Date(until).toISOString() : null,
    };

    const { error: upsertError } = await adminClient
      .from('user_status')
      .upsert(statusData, { onConflict: 'id' });

    if (upsertError) {
      console.error('Error updating user status:', upsertError);
      return NextResponse.json({ error: 'Failed to update user status' }, { status: 500 });
    }

    // Log the admin action
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    try {
      await adminClient.from('admin_logs').insert({
        admin_email: user.email,
        action: `user_${status}`,
        target_type: 'user',
        target_id: userId,
        details: {
          status,
          reason: reason || null,
          until: until || null,
          target_email: targetUser?.user?.email,
        },
        ip_address: ip,
      });
    } catch (logErr) {
      console.error('Failed to log admin action:', logErr);
    }

    return NextResponse.json({
      success: true,
      status: statusData.status,
    });
  } catch (error) {
    console.error('User status update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Get user status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Verify admin access
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: adminCheck } = await supabase
      .from('admin_emails')
      .select('email')
      .eq('email', user.email?.toLowerCase())
      .single();

    if (!adminCheck) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const adminClient = createAdminClient();

    const { data: statusData, error } = await adminClient
      .from('user_status')
      .select('*')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 is "no rows returned" - that's fine, user just has default active status
      console.error('Error fetching user status:', error);
      return NextResponse.json({ error: 'Failed to fetch user status' }, { status: 500 });
    }

    return NextResponse.json({
      status: statusData?.status || 'active',
      suspended_at: statusData?.suspended_at || null,
      suspended_by: statusData?.suspended_by || null,
      suspend_reason: statusData?.suspend_reason || null,
      suspended_until: statusData?.suspended_until || null,
    });
  } catch (error) {
    console.error('User status fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
