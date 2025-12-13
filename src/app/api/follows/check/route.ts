import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/follows/check?userId=xxx
 * Check if current user follows a target user
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ isFollowing: false });
    }

    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const { data, error } = await supabase.rpc('is_following', {
      target_user_id: userId,
    });

    if (error) {
      console.error('Error checking follow status:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ isFollowing: data || false });
  } catch (error) {
    console.error('Follow check API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
