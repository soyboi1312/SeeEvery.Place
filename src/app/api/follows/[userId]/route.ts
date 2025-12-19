import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface RouteParams {
  params: Promise<{ userId: string }>;
}

/**
 * GET /api/follows/:userId
 * Get followers and following for a user
 * Query params: ?type=followers|following&limit=20&offset=0
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await params;
    const supabase = await createClient();

    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'followers';
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    if (!['followers', 'following'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type. Use: followers, following' },
        { status: 400 }
      );
    }

    const rpcFunction = type === 'followers' ? 'get_followers' : 'get_following';

    const { data, error } = await supabase.rpc(rpcFunction, {
      target_user_id: userId,
      page_limit: limit,
      page_offset: offset,
    });

    if (error) {
      console.error(`Error fetching ${type}:`, error);
      return NextResponse.json({ error: `Failed to fetch ${type}` }, { status: 500 });
    }

    return NextResponse.json({
      type,
      data: data || [],
      pagination: {
        limit,
        offset,
        hasMore: data?.length === limit,
      },
    });
  } catch (error) {
    console.error('Follows API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
