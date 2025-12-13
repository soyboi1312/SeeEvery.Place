import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ALL_CATEGORIES, Category } from '@/lib/types';

interface CategoryStats {
  totalUsersTracking: number;
  placeStats: {
    placeId: string;
    visitCount: number;
    bucketListCount: number;
    visitPercentage: number;
  }[];
}

/**
 * GET /api/stats/[category]
 * Returns public statistics for a category:
 * - Total users tracking this category
 * - Visit counts and percentages for each place
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    const { category } = await params;

    // Validate category
    if (!ALL_CATEGORIES.includes(category as Category)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Try to get stats from the normalized table first
    const { data: statsData, error: statsError } = await supabase
      .rpc('get_category_stats', { p_category: category });

    if (!statsError && statsData && statsData.length > 0) {
      // Get total users tracking this category
      const { count: totalUsers } = await supabase
        .from('visits')
        .select('user_id', { count: 'exact', head: true })
        .eq('category', category)
        .eq('status', 'visited');

      const response: CategoryStats = {
        totalUsersTracking: totalUsers || 0,
        placeStats: statsData.map((stat: {
          place_id: string;
          visit_count: number;
          bucket_list_count: number;
          visit_percentage: number;
        }) => ({
          placeId: stat.place_id,
          visitCount: stat.visit_count,
          bucketListCount: stat.bucket_list_count,
          visitPercentage: stat.visit_percentage,
        })),
      };

      // Cache for 5 minutes (public data)
      return NextResponse.json(response, {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      });
    }

    // Fallback: Return empty stats if normalized table not populated yet
    return NextResponse.json({
      totalUsersTracking: 0,
      placeStats: [],
      _note: 'Normalized visits table not yet populated. Run sync_visits_from_jsonb() to backfill.',
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    console.error('Category stats API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
