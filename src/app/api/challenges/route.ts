import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/challenges
 * Returns active time-bound challenges
 */
export async function GET() {
  try {
    const supabase = await createClient();

    // Get active challenges from database
    const { data: challenges, error } = await supabase
      .rpc('get_active_challenges');

    if (error) {
      console.error('Error fetching challenges:', error);
      // Return empty array if table doesn't exist yet
      return NextResponse.json({ challenges: [] }, {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      });
    }

    // Get user's progress if authenticated
    const { data: { user } } = await supabase.auth.getUser();
    let userProgress: Record<string, { currentCount: number; completedAt: string | null }> = {};

    if (user) {
      const { data: progress } = await supabase
        .from('user_challenges')
        .select('challenge_id, current_count, completed_at')
        .eq('user_id', user.id);

      if (progress) {
        userProgress = Object.fromEntries(
          progress.map(p => [p.challenge_id, {
            currentCount: p.current_count,
            completedAt: p.completed_at,
          }])
        );
      }
    }

    // Combine challenges with progress
    const challengesWithProgress = (challenges || []).map((challenge: {
      id: string;
      name: string;
      description: string;
      challenge_type: string;
      category: string | null;
      required_count: number;
      start_date: string;
      end_date: string | null;
      badge_icon: string;
      badge_name: string;
      xp_reward: number;
      days_remaining: number | null;
    }) => {
      const progress = userProgress[challenge.id];
      const currentCount = progress?.currentCount || 0;
      const progressPercent = Math.min(100, Math.round((currentCount / challenge.required_count) * 100));

      return {
        id: challenge.id,
        name: challenge.name,
        description: challenge.description,
        type: challenge.challenge_type,
        category: challenge.category,
        requiredCount: challenge.required_count,
        startDate: challenge.start_date,
        endDate: challenge.end_date,
        badgeIcon: challenge.badge_icon,
        badgeName: challenge.badge_name,
        xpReward: challenge.xp_reward,
        daysRemaining: challenge.days_remaining,
        // User progress
        currentCount,
        progress: progressPercent,
        isCompleted: progress?.completedAt != null,
        completedAt: progress?.completedAt,
      };
    });

    return NextResponse.json({ challenges: challengesWithProgress }, {
      headers: {
        'Cache-Control': user ? 'private, no-cache' : 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Challenges API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', challenges: [] },
      { status: 500 }
    );
  }
}
