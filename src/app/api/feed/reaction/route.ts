import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * POST /api/feed/reaction
 * Toggle a reaction (kudos) on an activity
 * Body: { activityId: string }
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { activityId } = body;

    if (!activityId) {
      return NextResponse.json({ error: 'activityId is required' }, { status: 400 });
    }

    const { data, error } = await supabase.rpc('toggle_activity_reaction', {
      p_activity_id: activityId,
    });

    if (error) {
      console.error('Error toggling reaction:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (data?.error) {
      return NextResponse.json({ error: data.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      action: data?.action || 'toggled',
    });
  } catch (error) {
    console.error('Reaction API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * GET /api/feed/reaction
 * Get reactions for an activity
 * Query params: ?activityId=uuid&limit=20&offset=0
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const searchParams = request.nextUrl.searchParams;
    const activityId = searchParams.get('activityId');
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    if (!activityId) {
      return NextResponse.json({ error: 'activityId is required' }, { status: 400 });
    }

    const { data, error } = await supabase.rpc('get_activity_reactions', {
      p_activity_id: activityId,
      page_limit: limit,
      page_offset: offset,
    });

    if (error) {
      console.error('Error fetching reactions:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const reactions = (data || []).map((reaction: {
      user_id: string;
      username: string;
      full_name: string | null;
      avatar_url: string | null;
      reacted_at: string;
    }) => ({
      userId: reaction.user_id,
      username: reaction.username,
      fullName: reaction.full_name,
      avatarUrl: reaction.avatar_url,
      reactedAt: reaction.reacted_at,
    }));

    return NextResponse.json({
      activityId,
      reactions,
      pagination: {
        limit,
        offset,
        hasMore: reactions.length === limit,
      },
    });
  } catch (error) {
    console.error('Reaction GET API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
