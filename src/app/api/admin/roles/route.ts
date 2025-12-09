import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

interface AdminEmail {
  id: string;
  email: string;
  role: string;
  created_at: string;
}

// Get all admins
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: adminCheck } = await supabase
      .from('admin_emails')
      .select('email, role')
      .eq('email', user.email?.toLowerCase())
      .single();

    if (!adminCheck) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const adminClient = createAdminClient();

    const { data: admins, error } = await adminClient
      .from('admin_emails')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching admins:', error);
      return NextResponse.json({ error: 'Failed to fetch admins' }, { status: 500 });
    }

    return NextResponse.json({
      admins: admins || [],
      currentRole: adminCheck.role,
    });
  } catch (error) {
    console.error('Admins fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Add new admin
export async function POST(request: NextRequest) {
  try {
    const { email, role } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Verify admin access
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if current user is super_admin
    const { data: adminCheck } = await supabase
      .from('admin_emails')
      .select('email, role')
      .eq('email', user.email?.toLowerCase())
      .single();

    if (!adminCheck) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (adminCheck.role !== 'super_admin') {
      return NextResponse.json({ error: 'Only super admins can add new admins' }, { status: 403 });
    }

    const adminClient = createAdminClient();

    // Check if email already exists
    const { data: existing } = await adminClient
      .from('admin_emails')
      .select('email')
      .eq('email', normalizedEmail)
      .single();

    if (existing) {
      return NextResponse.json({ error: 'Email is already an admin' }, { status: 400 });
    }

    // Insert new admin
    const { data: newAdmin, error } = await adminClient
      .from('admin_emails')
      .insert({
        email: normalizedEmail,
        role: role || 'admin',
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding admin:', error);
      return NextResponse.json({ error: 'Failed to add admin' }, { status: 500 });
    }

    // Log the action
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    try {
      await adminClient.from('admin_logs').insert({
        admin_email: user.email,
        action: 'add_admin',
        target_type: 'admin',
        target_id: newAdmin.id,
        details: { added_email: normalizedEmail, role: role || 'admin' },
        ip_address: ip,
      });
    } catch (logErr) {
      console.error('Failed to log admin action:', logErr);
    }

    return NextResponse.json({ success: true, admin: newAdmin });
  } catch (error) {
    console.error('Add admin error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Update admin role
export async function PUT(request: NextRequest) {
  try {
    const { adminId, role } = await request.json();

    if (!adminId || typeof adminId !== 'string') {
      return NextResponse.json({ error: 'Admin ID is required' }, { status: 400 });
    }

    if (!role || !['admin', 'super_admin'].includes(role)) {
      return NextResponse.json({ error: 'Valid role is required' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: adminCheck } = await supabase
      .from('admin_emails')
      .select('email, role')
      .eq('email', user.email?.toLowerCase())
      .single();

    if (!adminCheck || adminCheck.role !== 'super_admin') {
      return NextResponse.json({ error: 'Only super admins can modify roles' }, { status: 403 });
    }

    const adminClient = createAdminClient();

    // Get target admin
    const { data: targetAdmin } = await adminClient
      .from('admin_emails')
      .select('*')
      .eq('id', adminId)
      .single();

    if (!targetAdmin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    // Prevent demoting yourself
    if (targetAdmin.email === user.email?.toLowerCase() && role !== 'super_admin') {
      return NextResponse.json({ error: 'Cannot demote yourself' }, { status: 400 });
    }

    // Update role
    const { error } = await adminClient
      .from('admin_emails')
      .update({ role })
      .eq('id', adminId);

    if (error) {
      console.error('Error updating admin role:', error);
      return NextResponse.json({ error: 'Failed to update role' }, { status: 500 });
    }

    // Log the action
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    try {
      await adminClient.from('admin_logs').insert({
        admin_email: user.email,
        action: 'update_admin_role',
        target_type: 'admin',
        target_id: adminId,
        details: { target_email: targetAdmin.email, old_role: targetAdmin.role, new_role: role },
        ip_address: ip,
      });
    } catch (logErr) {
      console.error('Failed to log admin action:', logErr);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update admin role error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Remove admin
export async function DELETE(request: NextRequest) {
  try {
    const { adminId } = await request.json();

    if (!adminId || typeof adminId !== 'string') {
      return NextResponse.json({ error: 'Admin ID is required' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: adminCheck } = await supabase
      .from('admin_emails')
      .select('email, role')
      .eq('email', user.email?.toLowerCase())
      .single();

    if (!adminCheck || adminCheck.role !== 'super_admin') {
      return NextResponse.json({ error: 'Only super admins can remove admins' }, { status: 403 });
    }

    const adminClient = createAdminClient();

    // Get target admin
    const { data: targetAdmin } = await adminClient
      .from('admin_emails')
      .select('*')
      .eq('id', adminId)
      .single();

    if (!targetAdmin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    // Prevent removing yourself
    if (targetAdmin.email === user.email?.toLowerCase()) {
      return NextResponse.json({ error: 'Cannot remove yourself' }, { status: 400 });
    }

    // Delete admin
    const { error } = await adminClient
      .from('admin_emails')
      .delete()
      .eq('id', adminId);

    if (error) {
      console.error('Error removing admin:', error);
      return NextResponse.json({ error: 'Failed to remove admin' }, { status: 500 });
    }

    // Log the action
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    try {
      await adminClient.from('admin_logs').insert({
        admin_email: user.email,
        action: 'remove_admin',
        target_type: 'admin',
        target_id: adminId,
        details: { removed_email: targetAdmin.email },
        ip_address: ip,
      });
    } catch (logErr) {
      console.error('Failed to log admin action:', logErr);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Remove admin error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
