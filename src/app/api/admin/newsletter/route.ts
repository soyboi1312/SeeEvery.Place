import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

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

// GET /api/admin/newsletter - Get all newsletters
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { error, status } = await verifyAdmin(supabase);

    if (error) {
      return NextResponse.json({ error }, { status });
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const filterStatus = searchParams.get('status');

    const adminClient = createAdminClient();

    let query = adminClient
      .from('newsletters')
      .select('*', { count: 'exact' });

    if (filterStatus) {
      query = query.eq('status', filterStatus);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data: newsletters, error: fetchError, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (fetchError) {
      console.error('Error fetching newsletters:', fetchError);
      return NextResponse.json({ error: 'Failed to fetch newsletters' }, { status: 500 });
    }

    // Get status counts
    const { data: statusCounts } = await adminClient
      .from('newsletters')
      .select('status')
      .throwOnError();

    const stats = {
      total: statusCounts?.length || 0,
      draft: statusCounts?.filter(n => n.status === 'draft').length || 0,
      scheduled: statusCounts?.filter(n => n.status === 'scheduled').length || 0,
      sent: statusCounts?.filter(n => n.status === 'sent').length || 0,
    };

    return NextResponse.json({
      newsletters: newsletters || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        hasMore: count ? from + limit < count : false,
      },
      stats,
    });
  } catch (error) {
    console.error('Admin newsletters GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/admin/newsletter - Create a new newsletter
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { error, status, email: adminEmail } = await verifyAdmin(supabase);

    if (error || !adminEmail) {
      return NextResponse.json({ error: error || 'Unauthorized' }, { status });
    }

    const body = await request.json();

    if (!body.subject || body.subject.trim() === '') {
      return NextResponse.json({ error: 'Subject is required' }, { status: 400 });
    }

    if (!body.content_html || body.content_html.trim() === '') {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const adminClient = createAdminClient();

    const { data: newsletter, error: insertError } = await adminClient
      .from('newsletters')
      .insert({
        subject: body.subject.trim(),
        preview_text: body.preview_text?.trim() || null,
        content_html: body.content_html,
        content_text: body.content_text || null,
        status: body.status || 'draft',
        scheduled_at: body.scheduled_at || null,
        content_type: body.content_type || 'custom',
        content_metadata: body.content_metadata || null,
        created_by: adminEmail,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating newsletter:', insertError);
      return NextResponse.json({ error: 'Failed to create newsletter' }, { status: 500 });
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    await logAdminAction(adminEmail, 'create_newsletter', 'newsletter', newsletter.id, { subject: body.subject }, ip);

    return NextResponse.json({ newsletter });
  } catch (error) {
    console.error('Admin newsletters POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/admin/newsletter - Update a newsletter
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { error, status, email: adminEmail } = await verifyAdmin(supabase);

    if (error || !adminEmail) {
      return NextResponse.json({ error: error || 'Unauthorized' }, { status });
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Newsletter ID is required' }, { status: 400 });
    }

    const adminClient = createAdminClient();

    // Check if newsletter can be updated (not already sent)
    const { data: existing } = await adminClient
      .from('newsletters')
      .select('status')
      .eq('id', id)
      .single();

    if (existing?.status === 'sent' || existing?.status === 'sending') {
      return NextResponse.json({ error: 'Cannot update a sent or sending newsletter' }, { status: 400 });
    }

    const { data: newsletter, error: updateError } = await adminClient
      .from('newsletters')
      .update({
        subject: updates.subject?.trim(),
        preview_text: updates.preview_text?.trim() || null,
        content_html: updates.content_html,
        content_text: updates.content_text || null,
        status: updates.status,
        scheduled_at: updates.scheduled_at,
        content_type: updates.content_type,
        content_metadata: updates.content_metadata,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating newsletter:', updateError);
      return NextResponse.json({ error: 'Failed to update newsletter' }, { status: 500 });
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    await logAdminAction(adminEmail, 'update_newsletter', 'newsletter', id, { subject: updates.subject }, ip);

    return NextResponse.json({ newsletter });
  } catch (error) {
    console.error('Admin newsletters PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/admin/newsletter - Delete a newsletter
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { error, status, email: adminEmail } = await verifyAdmin(supabase);

    if (error || !adminEmail) {
      return NextResponse.json({ error: error || 'Unauthorized' }, { status });
    }

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Newsletter ID is required' }, { status: 400 });
    }

    const adminClient = createAdminClient();

    // Get newsletter details for logging
    const { data: newsletter } = await adminClient
      .from('newsletters')
      .select('subject, status')
      .eq('id', id)
      .single();

    if (newsletter?.status === 'sending') {
      return NextResponse.json({ error: 'Cannot delete a newsletter that is being sent' }, { status: 400 });
    }

    const { error: deleteError } = await adminClient
      .from('newsletters')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting newsletter:', deleteError);
      return NextResponse.json({ error: 'Failed to delete newsletter' }, { status: 500 });
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    await logAdminAction(adminEmail, 'delete_newsletter', 'newsletter', id, { subject: newsletter?.subject }, ip);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin newsletters DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
