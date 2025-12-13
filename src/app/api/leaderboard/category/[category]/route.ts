import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface RouteParams {
  params: Promise<{ category: string }>;
}

/**
 * GET /api/leaderboard/category/:category
 * Get category-specific leaderboard (visits count)
 * Query params: ?limit=50&offset=0
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { category } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    const { data, error } = await supabase.rpc('get_category_leaderboard', {
      p_category: category,
      page_limit: limit,
      page_offset: offset,
    });

    if (error) {
      console.error('Error fetching category leaderboard:', error);
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
      visit_count: number;
    }) => ({
      rank: entry.rank,
      user: {
        id: entry.user_id,
        username: entry.username,
        fullName: entry.full_name,
        avatarUrl: entry.avatar_url,
        level: entry.level,
      },
      visitCount: entry.visit_count,
      isCurrentUser: user?.id === entry.user_id,
    }));

    return NextResponse.json({
      category,
      leaderboard,
      pagination: {
        limit,
        offset,
        hasMore: leaderboard.length === limit,
      },
    });
  } catch (error) {
    console.error('Category leaderboard API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
