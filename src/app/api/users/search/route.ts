import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/users/search
 * Search for users by username or name
 * Query params: ?q=searchterm&limit=20&offset=0
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    if (!query || query.trim().length < 2) {
      return NextResponse.json({
        error: 'Search query must be at least 2 characters'
      }, { status: 400 });
    }

    const { data, error } = await supabase.rpc('search_users', {
      search_query: query.trim(),
      page_limit: limit,
      page_offset: offset,
    });

    if (error) {
      console.error('Error searching users:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Transform to frontend-friendly format
    const users = (data || []).map((user: {
      user_id: string;
      username: string;
      full_name: string | null;
      avatar_url: string | null;
      bio: string | null;
      level: number;
      total_xp: number;
      follower_count: number;
      is_following: boolean;
    }) => ({
      id: user.user_id,
      username: user.username,
      fullName: user.full_name,
      avatarUrl: user.avatar_url,
      bio: user.bio,
      level: user.level,
      totalXp: user.total_xp,
      followerCount: user.follower_count,
      isFollowing: user.is_following,
    }));

    return NextResponse.json({
      users,
      query,
      pagination: {
        limit,
        offset,
        hasMore: users.length === limit,
      },
    });
  } catch (error) {
    console.error('User search API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
