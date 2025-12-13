import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { STREAK_ACHIEVEMENTS } from '@/lib/challenges';

/**
 * GET /api/streaks
 * Returns user's streak information
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get streaks from database
    const { data: streaks, error } = await supabase
      .rpc('get_user_streaks');

    if (error) {
      console.error('Error fetching streaks:', error);
      // Return default values if function doesn't exist yet
      return NextResponse.json({
        currentLoginStreak: 0,
        longestLoginStreak: 0,
        lastLoginDate: null,
        currentSeasonStreak: 0,
        longestSeasonStreak: 0,
        monthlyVisits: {},
        streakAchievements: [],
      });
    }

    // Calculate which streak achievements are unlocked
    const unlockedAchievements = STREAK_ACHIEVEMENTS.filter(achievement => {
      const { type, count } = achievement.requirement;
      if (type === 'login_streak') {
        return (streaks?.longest_login_streak || 0) >= count;
      }
      if (type === 'season_streak') {
        return (streaks?.longest_season_streak || 0) >= count;
      }
      return false;
    });

    // Calculate next milestone for each streak type
    const nextLoginMilestone = STREAK_ACHIEVEMENTS
      .filter(a => a.requirement.type === 'login_streak')
      .find(a => a.requirement.count > (streaks?.longest_login_streak || 0));

    const nextSeasonMilestone = STREAK_ACHIEVEMENTS
      .filter(a => a.requirement.type === 'season_streak')
      .find(a => a.requirement.count > (streaks?.longest_season_streak || 0));

    return NextResponse.json({
      currentLoginStreak: streaks?.current_login_streak || 0,
      longestLoginStreak: streaks?.longest_login_streak || 0,
      lastLoginDate: streaks?.last_login_date || null,
      currentSeasonStreak: streaks?.current_season_streak || 0,
      longestSeasonStreak: streaks?.longest_season_streak || 0,
      monthlyVisits: streaks?.monthly_visits || {},
      streakAchievements: unlockedAchievements.map(a => ({
        id: a.id,
        name: a.name,
        icon: a.icon,
        tier: a.tier,
      })),
      nextLoginMilestone: nextLoginMilestone ? {
        name: nextLoginMilestone.name,
        required: nextLoginMilestone.requirement.count,
        progress: Math.round(((streaks?.current_login_streak || 0) / nextLoginMilestone.requirement.count) * 100),
      } : null,
      nextSeasonMilestone: nextSeasonMilestone ? {
        name: nextSeasonMilestone.name,
        required: nextSeasonMilestone.requirement.count,
        progress: Math.round(((streaks?.current_season_streak || 0) / nextSeasonMilestone.requirement.count) * 100),
      } : null,
    });
  } catch (error) {
    console.error('Streaks API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/streaks
 * Records user activity (login or selection)
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const activityType = body.type || 'login';

    if (!['login', 'selection'].includes(activityType)) {
      return NextResponse.json(
        { error: 'Invalid activity type' },
        { status: 400 }
      );
    }

    // Record activity
    const { data: result, error } = await supabase
      .rpc('record_user_activity', { p_activity_type: activityType });

    if (error) {
      console.error('Error recording activity:', error);
      return NextResponse.json(
        { error: 'Failed to record activity' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      currentStreak: result?.current_streak || 0,
      longestStreak: result?.longest_streak || 0,
    });
  } catch (error) {
    console.error('Streaks POST API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
