import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/leaderboard/rank
 * Get current user's rank on the global leaderboard
 * Query params: ?userId=xxx (optional, defaults to current user)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const userId = request.nextUrl.searchParams.get('userId') || user?.id;

    if (!userId) {
      return NextResponse.json({ error: 'User not specified' }, { status: 400 });
    }

    const { data, error } = await supabase.rpc('get_user_rank', {
      target_user_id: userId,
    });

    if (error) {
      console.error('Error fetching user rank:', error);
      return NextResponse.json({ error: 'Failed to fetch user rank' }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({
        rank: null,
        totalPlayers: 0,
        percentile: 0,
      });
    }

    return NextResponse.json({
      rank: data[0].global_rank,
      totalPlayers: data[0].total_players,
      percentile: data[0].percentile,
    });
  } catch (error) {
    console.error('Rank API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
