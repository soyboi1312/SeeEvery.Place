import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/notifications
 * Get notifications for the current user
 * Query params: ?limit=20&offset=0&unread_only=false
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const unreadOnly = searchParams.get('unread_only') === 'true';

    const { data, error } = await supabase.rpc('get_notifications', {
      page_limit: limit,
      page_offset: offset,
      unread_only: unreadOnly,
    });

    if (error) {
      console.error('Error fetching notifications:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get unread count
    const { data: countData } = await supabase.rpc('get_unread_notification_count');

    return NextResponse.json({
      notifications: data || [],
      unreadCount: countData || 0,
      pagination: {
        limit,
        offset,
        hasMore: (data || []).length === limit,
      },
    });
  } catch (error) {
    console.error('Notifications API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/notifications
 * Mark notifications as read
 * Body: { notificationIds?: string[] } - if empty/null, marks all as read
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { notificationIds } = body;

    const { data, error } = await supabase.rpc('mark_notifications_read', {
      notification_ids: notificationIds || null,
    });

    if (error) {
      console.error('Error marking notifications read:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      markedCount: data,
    });
  } catch (error) {
    console.error('Notifications API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/notifications
 * Delete a notification
 * Body: { notificationId: string }
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { notificationId } = body;

    if (!notificationId) {
      return NextResponse.json({ error: 'notificationId is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting notification:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Notifications API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
