import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/leaderboard
 * Get XP leaderboard
 * Query params: ?type=global|friends&period=all_time|monthly|weekly&limit=50&offset=0
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'global';
    const period = searchParams.get('period') || 'all_time';
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    if (!['global', 'friends'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type. Use: global, friends' },
        { status: 400 }
      );
    }

    if (!['all_time', 'monthly', 'weekly'].includes(period)) {
      return NextResponse.json(
        { error: 'Invalid period. Use: all_time, monthly, weekly' },
        { status: 400 }
      );
    }

    // Friends leaderboard requires authentication
    if (type === 'friends' && !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let data, error;

    if (type === 'friends') {
      const result = await supabase.rpc('get_friends_leaderboard', {
        time_period: period,
      });
      data = result.data;
      error = result.error;
    } else {
      const result = await supabase.rpc('get_xp_leaderboard', {
        time_period: period,
        page_limit: limit,
        page_offset: offset,
      });
      data = result.data;
      error = result.error;
    }

    if (error) {
      console.error('Error fetching leaderboard:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Transform data to frontend-friendly format
    const leaderboard = (data || []).map((entry: {
      rank: number;
      user_id: string;
      username: string;
      full_name: string | null;
      avatar_url: string | null;
      level: number;
      total_xp: number;
      follower_count?: number;
    }) => ({
      rank: entry.rank,
      user: {
        id: entry.user_id,
        username: entry.username,
        fullName: entry.full_name,
        avatarUrl: entry.avatar_url,
        level: entry.level,
        followerCount: entry.follower_count,
      },
      xp: entry.total_xp,
      isCurrentUser: user?.id === entry.user_id,
    }));

    // Get current user's rank if authenticated and on global leaderboard
    let currentUserRank = null;
    if (user && type === 'global') {
      const { data: rankData } = await supabase.rpc('get_user_rank', {
        target_user_id: user.id,
      });
      if (rankData && rankData.length > 0) {
        currentUserRank = {
          rank: rankData[0].global_rank,
          totalPlayers: rankData[0].total_players,
          percentile: rankData[0].percentile,
        };
      }
    }

    return NextResponse.json({
      type,
      period,
      leaderboard,
      currentUserRank,
      pagination: type === 'global' ? {
        limit,
        offset,
        hasMore: leaderboard.length === limit,
      } : null,
    });
  } catch (error) {
    console.error('Leaderboard API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
