import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

// Zod schema for POST request validation
// NOTE: xpEarned is intentionally NOT accepted from clients to prevent XP spoofing.
// XP is calculated server-side in the record_activity RPC based on activity type.
const ActivitySchema = z.object({
  activityType: z.enum(['visit', 'achievement', 'level_up', 'challenge_complete', 'started_tracking', 'bucket_list']),
  category: z.string().nullable().optional(),
  placeId: z.string().nullable().optional(),
  placeName: z.string().nullable().optional(),
  achievementId: z.string().nullable().optional(),
  achievementName: z.string().nullable().optional(),
  oldLevel: z.number().int().nullable().optional(),
  newLevel: z.number().int().nullable().optional(),
  challengeId: z.string().nullable().optional(),
  challengeName: z.string().nullable().optional(),
});

/**
 * GET /api/feed
 * Get activity feed
 * Query params: ?type=friends|global&limit=20&offset=0&filter=visit|achievement|level_up
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'global';
    // Cap limit at 50 to prevent abuse (e.g., ?limit=10000)
    const rawLimit = parseInt(searchParams.get('limit') || '20', 10);
    const limit = Math.min(Math.max(rawLimit, 1), 50);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const filter = searchParams.get('filter') || null;

    if (!['friends', 'global'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type. Use: friends, global' },
        { status: 400 }
      );
    }

    // Friends feed requires authentication
    if (type === 'friends' && !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let data, error;

    // Fetch limit + 1 to determine if there are more items without an extra request
    // This prevents the "off-by-one" issue where exactly N items triggers a wasted fetch
    const fetchLimit = limit + 1;

    if (type === 'friends') {
      const result = await supabase.rpc('get_friends_activity_feed', {
        page_limit: fetchLimit,
        page_offset: offset,
      });
      data = result.data;
      error = result.error;
    } else {
      const result = await supabase.rpc('get_global_activity_feed', {
        page_limit: fetchLimit,
        page_offset: offset,
        filter_type: filter,
      });
      data = result.data;
      error = result.error;
    }

    if (error) {
      console.error('Error fetching feed:', error);
      return NextResponse.json({ error: 'Failed to fetch activity feed' }, { status: 500 });
    }

    // Determine hasMore based on whether we got the extra item
    const hasMore = (data || []).length > limit;
    // Only return the requested number of items
    const trimmedData = hasMore ? (data || []).slice(0, limit) : (data || []);

    // Transform the data to a more frontend-friendly format
    const activities = trimmedData.map((activity: {
      id: string;
      user_id: string;
      username: string;
      full_name: string | null;
      avatar_url: string | null;
      user_level: number;
      activity_type: string;
      category: string | null;
      place_id: string | null;
      place_name: string | null;
      achievement_id: string | null;
      achievement_name: string | null;
      old_level: number | null;
      new_level: number | null;
      challenge_name: string | null;
      xp_earned: number | null;
      reaction_count: number | null;
      has_reacted: boolean | null;
      created_at: string;
    }) => ({
      id: activity.id,
      user: {
        id: activity.user_id,
        username: activity.username,
        fullName: activity.full_name,
        avatarUrl: activity.avatar_url,
        level: activity.user_level,
      },
      type: activity.activity_type,
      data: {
        category: activity.category,
        placeId: activity.place_id,
        placeName: activity.place_name,
        achievementId: activity.achievement_id,
        achievementName: activity.achievement_name,
        oldLevel: activity.old_level,
        newLevel: activity.new_level,
        challengeName: activity.challenge_name,
        xpEarned: activity.xp_earned,
      },
      reactionCount: activity.reaction_count || 0,
      hasReacted: activity.has_reacted || false,
      createdAt: activity.created_at,
    }));

    return NextResponse.json({
      type,
      activities,
      pagination: {
        limit,
        offset,
        hasMore,
      },
    });
  } catch (error) {
    console.error('Feed API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/feed
 * Record a new activity
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Validate request body with Zod
    const parseResult = ActivitySchema.safeParse(body);
    if (!parseResult.success) {
      // Return all validation errors in a single message
      const errorMessage = parseResult.error.issues
        .map(issue => issue.message)
        .join('. ');
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      );
    }

    const {
      activityType,
      category,
      placeId,
      placeName,
      achievementId,
      achievementName,
      oldLevel,
      newLevel,
      challengeId,
      challengeName,
    } = parseResult.data;

    // XP is calculated server-side in the RPC to prevent spoofing
    const { data, error } = await supabase.rpc('record_activity', {
      p_activity_type: activityType,
      p_category: category || null,
      p_place_id: placeId || null,
      p_place_name: placeName || null,
      p_achievement_id: achievementId || null,
      p_achievement_name: achievementName || null,
      p_old_level: oldLevel || null,
      p_new_level: newLevel || null,
      p_challenge_id: challengeId || null,
      p_challenge_name: challengeName || null,
    });

    if (error) {
      console.error('Error recording activity:', error);
      return NextResponse.json({ error: 'Failed to record activity' }, { status: 500 });
    }

    return NextResponse.json({ success: true, activityId: data });
  } catch (error) {
    console.error('Feed POST API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
