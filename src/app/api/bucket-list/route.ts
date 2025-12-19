import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/bucket-list
 * Get mutual bucket list with a friend or friends who share a bucket list item
 * Query params:
 *   ?friendId=uuid - Get mutual bucket list items with a specific friend
 *   ?category=string&placeId=string - Get friends who have this place on their bucket list
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const friendId = searchParams.get('friendId');
    const category = searchParams.get('category');
    const placeId = searchParams.get('placeId');

    if (friendId) {
      // Get mutual bucket list with a specific friend
      const { data, error } = await supabase.rpc('get_mutual_bucket_list', {
        p_friend_id: friendId,
      });

      if (error) {
        console.error('Error fetching mutual bucket list:', error);
        return NextResponse.json({ error: 'Failed to fetch mutual bucket list' }, { status: 500 });
      }

      const items = (data || []).map((item: {
        category: string;
        place_id: string;
        place_name: string;
      }) => ({
        category: item.category,
        placeId: item.place_id,
        placeName: item.place_name,
      }));

      return NextResponse.json({
        friendId,
        mutualBucketList: items,
        count: items.length,
      });
    } else if (category && placeId) {
      // Get friends who have this place on their bucket list
      const { data, error } = await supabase.rpc('get_bucket_list_friends', {
        p_category: category,
        p_place_id: placeId,
      });

      if (error) {
        console.error('Error fetching bucket list friends:', error);
        return NextResponse.json({ error: 'Failed to fetch bucket list friends' }, { status: 500 });
      }

      const friends = (data || []).map((friend: {
        user_id: string;
        username: string;
        full_name: string | null;
        avatar_url: string | null;
      }) => ({
        userId: friend.user_id,
        username: friend.username,
        fullName: friend.full_name,
        avatarUrl: friend.avatar_url,
      }));

      return NextResponse.json({
        category,
        placeId,
        friends,
        count: friends.length,
      });
    } else {
      return NextResponse.json(
        { error: 'Either friendId or (category + placeId) is required' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Bucket list API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
