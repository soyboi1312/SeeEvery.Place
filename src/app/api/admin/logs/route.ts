import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

// GET /api/admin/logs - Get admin activity logs
export async function GET(request: NextRequest) {
  try {
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

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50', 10)));
    const action = searchParams.get('action');
    const adminEmail = searchParams.get('admin');

    const adminClient = createAdminClient();

    // Build query
    let query = adminClient
      .from('admin_logs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (action) {
      query = query.eq('action', action);
    }

    if (adminEmail) {
      query = query.eq('admin_email', adminEmail);
    }

    const { data: logs, error: fetchError, count } = await query;

    if (fetchError) {
      console.error('Error fetching logs:', fetchError);
      return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
    }

    return NextResponse.json({
      logs: logs || [],
      pagination: {
        page,
        limit,
        count: count || 0,
        hasMore: (count || 0) > page * limit,
      },
    });
  } catch (error) {
    console.error('Admin logs GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
