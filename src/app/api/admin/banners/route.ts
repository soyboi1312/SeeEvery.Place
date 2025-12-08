import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

interface BannerInput {
  message: string;
  type?: 'info' | 'warning' | 'success' | 'error';
  link_text?: string;
  link_url?: string;
  is_active?: boolean;
  starts_at?: string;
  ends_at?: string | null;
}

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

// GET /api/admin/banners - Get all banners for admin management
export async function GET() {
  try {
    const supabase = await createClient();
    const { error, status } = await verifyAdmin(supabase);

    if (error) {
      return NextResponse.json({ error }, { status });
    }

    const adminClient = createAdminClient();

    const { data: banners, error: fetchError } = await adminClient
      .from('system_banners')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('Error fetching banners:', fetchError);
      return NextResponse.json({ error: 'Failed to fetch banners' }, { status: 500 });
    }

    return NextResponse.json({ banners: banners || [] });
  } catch (error) {
    console.error('Admin banners GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/admin/banners - Create a new banner
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { error, status, email } = await verifyAdmin(supabase);

    if (error || !email) {
      return NextResponse.json({ error: error || 'Unauthorized' }, { status });
    }

    const body: BannerInput = await request.json();

    if (!body.message || body.message.trim() === '') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const adminClient = createAdminClient();

    const { data: banner, error: insertError } = await adminClient
      .from('system_banners')
      .insert({
        message: body.message.trim(),
        type: body.type || 'info',
        link_text: body.link_text?.trim() || null,
        link_url: body.link_url?.trim() || null,
        is_active: body.is_active ?? true,
        starts_at: body.starts_at || new Date().toISOString(),
        ends_at: body.ends_at || null,
        created_by: email,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating banner:', insertError);
      return NextResponse.json({ error: 'Failed to create banner' }, { status: 500 });
    }

    // Log the action
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    await logAdminAction(email, 'create_banner', 'banner', banner.id, { message: body.message }, ip);

    return NextResponse.json({ banner });
  } catch (error) {
    console.error('Admin banners POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/admin/banners - Update a banner
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { error, status, email } = await verifyAdmin(supabase);

    if (error || !email) {
      return NextResponse.json({ error: error || 'Unauthorized' }, { status });
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Banner ID is required' }, { status: 400 });
    }

    const adminClient = createAdminClient();

    const { data: banner, error: updateError } = await adminClient
      .from('system_banners')
      .update({
        message: updates.message?.trim(),
        type: updates.type,
        link_text: updates.link_text?.trim() || null,
        link_url: updates.link_url?.trim() || null,
        is_active: updates.is_active,
        starts_at: updates.starts_at,
        ends_at: updates.ends_at,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating banner:', updateError);
      return NextResponse.json({ error: 'Failed to update banner' }, { status: 500 });
    }

    // Log the action
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    await logAdminAction(email, 'update_banner', 'banner', id, { changes: updates }, ip);

    return NextResponse.json({ banner });
  } catch (error) {
    console.error('Admin banners PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/admin/banners - Delete a banner
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { error, status, email } = await verifyAdmin(supabase);

    if (error || !email) {
      return NextResponse.json({ error: error || 'Unauthorized' }, { status });
    }

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Banner ID is required' }, { status: 400 });
    }

    const adminClient = createAdminClient();

    // Get banner details for logging
    const { data: banner } = await adminClient
      .from('system_banners')
      .select('message')
      .eq('id', id)
      .single();

    const { error: deleteError } = await adminClient
      .from('system_banners')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting banner:', deleteError);
      return NextResponse.json({ error: 'Failed to delete banner' }, { status: 500 });
    }

    // Log the action
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    await logAdminAction(email, 'delete_banner', 'banner', id, { message: banner?.message }, ip);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin banners DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
