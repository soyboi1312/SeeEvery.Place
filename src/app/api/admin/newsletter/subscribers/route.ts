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

// GET /api/admin/newsletter/subscribers - Get all subscribers
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { error, status } = await verifyAdmin(supabase);

    if (error) {
      return NextResponse.json({ error }, { status });
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';
    const filterActive = searchParams.get('active');

    const adminClient = createAdminClient();

    let query = adminClient
      .from('newsletter_subscribers')
      .select('*', { count: 'exact' });

    // Apply filters
    if (search) {
      query = query.or(`email.ilike.%${search}%,name.ilike.%${search}%`);
    }

    if (filterActive === 'true') {
      query = query.eq('is_active', true);
    } else if (filterActive === 'false') {
      query = query.eq('is_active', false);
    }

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data: subscribers, error: fetchError, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (fetchError) {
      console.error('Error fetching subscribers:', fetchError);
      return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 });
    }

    // Get stats
    const { data: stats } = await adminClient
      .from('newsletter_subscribers')
      .select('is_active, confirmed_at')
      .throwOnError();

    const totalSubscribers = stats?.length || 0;
    const activeSubscribers = stats?.filter(s => s.is_active).length || 0;
    const confirmedSubscribers = stats?.filter(s => s.confirmed_at).length || 0;

    return NextResponse.json({
      subscribers: subscribers || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        hasMore: count ? from + limit < count : false,
      },
      stats: {
        total: totalSubscribers,
        active: activeSubscribers,
        confirmed: confirmedSubscribers,
        unsubscribed: totalSubscribers - activeSubscribers,
      },
    });
  } catch (error) {
    console.error('Admin subscribers GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/admin/newsletter/subscribers - Add a subscriber manually
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { error, status, email: adminEmail } = await verifyAdmin(supabase);

    if (error || !adminEmail) {
      return NextResponse.json({ error: error || 'Unauthorized' }, { status });
    }

    const body = await request.json();

    if (!body.email || !body.email.trim()) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const adminClient = createAdminClient();

    // Check if already exists
    const { data: existing } = await adminClient
      .from('newsletter_subscribers')
      .select('id, is_active')
      .eq('email', body.email.toLowerCase().trim())
      .single();

    if (existing) {
      if (existing.is_active) {
        return NextResponse.json({ error: 'Email already subscribed' }, { status: 400 });
      }
      // Reactivate
      const { data: subscriber, error: updateError } = await adminClient
        .from('newsletter_subscribers')
        .update({
          is_active: true,
          name: body.name?.trim() || null,
          unsubscribed_at: null,
          unsubscribe_reason: null,
          confirmed_at: new Date().toISOString(), // Admin-added are auto-confirmed
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (updateError) {
        return NextResponse.json({ error: 'Failed to reactivate subscriber' }, { status: 500 });
      }

      const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
      await logAdminAction(adminEmail, 'reactivate_subscriber', 'subscriber', subscriber.id, { email: body.email }, ip);

      return NextResponse.json({ subscriber, reactivated: true });
    }

    // Create new subscriber
    const { data: subscriber, error: insertError } = await adminClient
      .from('newsletter_subscribers')
      .insert({
        email: body.email.toLowerCase().trim(),
        name: body.name?.trim() || null,
        source: 'admin',
        is_active: true,
        confirmed_at: new Date().toISOString(), // Admin-added are auto-confirmed
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error adding subscriber:', insertError);
      return NextResponse.json({ error: 'Failed to add subscriber' }, { status: 500 });
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    await logAdminAction(adminEmail, 'add_subscriber', 'subscriber', subscriber.id, { email: body.email }, ip);

    return NextResponse.json({ subscriber });
  } catch (error) {
    console.error('Admin subscribers POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/admin/newsletter/subscribers - Delete a subscriber
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { error, status, email: adminEmail } = await verifyAdmin(supabase);

    if (error || !adminEmail) {
      return NextResponse.json({ error: error || 'Unauthorized' }, { status });
    }

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Subscriber ID is required' }, { status: 400 });
    }

    const adminClient = createAdminClient();

    // Get subscriber details for logging
    const { data: subscriber } = await adminClient
      .from('newsletter_subscribers')
      .select('email')
      .eq('id', id)
      .single();

    const { error: deleteError } = await adminClient
      .from('newsletter_subscribers')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting subscriber:', deleteError);
      return NextResponse.json({ error: 'Failed to delete subscriber' }, { status: 500 });
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    await logAdminAction(adminEmail, 'delete_subscriber', 'subscriber', id, { email: subscriber?.email }, ip);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin subscribers DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
