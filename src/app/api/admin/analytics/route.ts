import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { ALL_CATEGORIES, Category } from '@/lib/types';

interface CategoryStat {
  category: string;
  usersTracking: number;
  avgVisited: number;
  avgBucketList: number;
  maxVisited: number;
  totalVisited: number;
}

interface PopularItem {
  id: string;
  timesVisited: number;
  timesBucketListed: number;
}

interface AnalyticsData {
  overview: {
    totalUsers: number;
    usersWithSelections: number;
    usersTrackingStates: number;
    usersTrackingCountries: number;
  };
  categoryStats: CategoryStat[];
  popularStates: PopularItem[];
  popularCountries: PopularItem[];
  // Popular items for ALL categories (sorted by visits descending)
  popularItems: Record<string, PopularItem[]>;
  // Timeframe info
  timeframe: string;
  timeframeLabel: string;
}

type Timeframe = 'allTime' | 'last30Days' | 'last7Days' | 'previousMonth';

function getTimeframeBounds(timeframe: Timeframe): { start: number | null; end: number | null; label: string } {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;

  switch (timeframe) {
    case 'last7Days':
      return { start: now - 7 * day, end: null, label: 'Last 7 Days' };
    case 'last30Days':
      return { start: now - 30 * day, end: null, label: 'Last 30 Days' };
    case 'previousMonth': {
      const date = new Date();
      const firstOfThisMonth = new Date(date.getFullYear(), date.getMonth(), 1).getTime();
      const firstOfLastMonth = new Date(date.getFullYear(), date.getMonth() - 1, 1).getTime();
      return { start: firstOfLastMonth, end: firstOfThisMonth, label: 'Previous Month' };
    }
    default:
      return { start: null, end: null, label: 'All Time' };
  }
}

export async function GET(request: NextRequest) {
  try {
    // Parse timeframe from query params
    const { searchParams } = new URL(request.url);
    const timeframe = (searchParams.get('timeframe') || 'allTime') as Timeframe;
    const timeframeBounds = getTimeframeBounds(timeframe);

    // Verify admin access using the user's session
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const { data: adminCheck } = await supabase
      .from('admin_emails')
      .select('email')
      .eq('email', user.email?.toLowerCase())
      .single();

    if (!adminCheck) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Use admin client to bypass RLS for analytics
    const adminClient = createAdminClient();

    // Try database-side aggregation first (more scalable)
    // Falls back to in-memory processing if RPC doesn't exist
    // Note: RPC doesn't support timeframe filtering yet
    if (timeframe === 'allTime') {
      const { data: rpcData, error: rpcError } = await adminClient.rpc('get_analytics_summary');

      if (!rpcError && rpcData) {
        // RPC succeeded - return database-aggregated data
        return NextResponse.json({ ...rpcData, timeframe, timeframeLabel: timeframeBounds.label });
      }
    }

    // Fallback: fetch and process in-memory (works without migration)
    // Note: This approach doesn't scale well with many users
    console.warn('Analytics RPC not available or timeframe filtering requested, falling back to in-memory processing');

    const { data: allSelections, error } = await adminClient
      .from('user_selections')
      .select('user_id, selections');

    if (error) {
      console.error('Error fetching selections:', error);
      return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }

    const analytics = processAnalytics(allSelections || [], timeframeBounds.start, timeframeBounds.end);

    return NextResponse.json({ ...analytics, timeframe, timeframeLabel: timeframeBounds.label });
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

interface SelectionItem {
  id: string;
  status: 'visited' | 'bucketList' | 'unvisited';
  deleted?: boolean;
  updatedAt?: number;
}

interface UserSelectionsRow {
  user_id: string;
  selections: Record<string, SelectionItem[]>;
}

function processAnalytics(
  rows: UserSelectionsRow[],
  startTime: number | null = null,
  endTime: number | null = null
): Omit<AnalyticsData, 'timeframe' | 'timeframeLabel'> {
  const totalUsers = rows.length;
  let usersWithSelections = 0;
  let usersTrackingStates = 0;
  let usersTrackingCountries = 0;

  // Category stats accumulators - use ALL_CATEGORIES from types.ts (single source of truth)
  const categoryData: Record<string, { users: Set<string>; visited: number[]; bucketList: number[]; totalVisited: number }> = {};
  for (const cat of ALL_CATEGORIES) {
    categoryData[cat] = { users: new Set(), visited: [], bucketList: [], totalVisited: 0 };
  }

  // Popular items tracking for ALL categories
  const itemVisits: Record<string, Record<string, { visited: number; bucketList: number }>> = {};
  for (const cat of ALL_CATEGORIES) {
    itemVisits[cat] = {};
  }

  for (const row of rows) {
    const selections = row.selections || {};
    let hasAnySelection = false;

    for (const category of ALL_CATEGORIES) {
      const items = (selections[category] || []) as SelectionItem[];
      // Filter by deletion status and timeframe
      const activeItems = items.filter(item => {
        if (item.deleted) return false;
        // If no timeframe filtering, include all
        if (!startTime && !endTime) return true;
        // If item has no updatedAt, include it (legacy data)
        if (!item.updatedAt) return true;
        // Check timeframe bounds
        if (startTime && item.updatedAt < startTime) return false;
        if (endTime && item.updatedAt >= endTime) return false;
        return true;
      });

      if (activeItems.length > 0) {
        hasAnySelection = true;
        categoryData[category].users.add(row.user_id);
      }

      let visitedCount = 0;
      let bucketListCount = 0;

      for (const item of activeItems) {
        if (item.status === 'visited') {
          visitedCount++;
          categoryData[category].totalVisited++;

          // Track popular items for ALL categories
          itemVisits[category][item.id] = itemVisits[category][item.id] || { visited: 0, bucketList: 0 };
          itemVisits[category][item.id].visited++;
        } else if (item.status === 'bucketList') {
          bucketListCount++;

          // Track bucket list items for ALL categories
          itemVisits[category][item.id] = itemVisits[category][item.id] || { visited: 0, bucketList: 0 };
          itemVisits[category][item.id].bucketList++;
        }
      }

      if (visitedCount > 0 || bucketListCount > 0) {
        categoryData[category].visited.push(visitedCount);
        categoryData[category].bucketList.push(bucketListCount);
      }

      if (category === 'states' && visitedCount > 0) usersTrackingStates++;
      if (category === 'countries' && visitedCount > 0) usersTrackingCountries++;
    }

    if (hasAnySelection) usersWithSelections++;
  }

  // Calculate category stats
  const categoryStats: CategoryStat[] = [...ALL_CATEGORIES]
    .map(category => {
      const data = categoryData[category];
      const visitedArray = data.visited;
      const bucketListArray = data.bucketList;

      return {
        category,
        usersTracking: data.users.size,
        avgVisited: visitedArray.length > 0
          ? Math.round((visitedArray.reduce((a, b) => a + b, 0) / visitedArray.length) * 100) / 100
          : 0,
        avgBucketList: bucketListArray.length > 0
          ? Math.round((bucketListArray.reduce((a, b) => a + b, 0) / bucketListArray.length) * 100) / 100
          : 0,
        maxVisited: visitedArray.length > 0 ? Math.max(...visitedArray) : 0,
        totalVisited: data.totalVisited,
      };
    })
    .filter(stat => stat.usersTracking > 0)
    .sort((a, b) => b.usersTracking - a.usersTracking);

  // Build popular items for ALL categories (sorted by visits descending)
  const popularItems: Record<string, PopularItem[]> = {};
  for (const category of ALL_CATEGORIES) {
    popularItems[category] = Object.entries(itemVisits[category])
      .map(([id, counts]) => ({ id, timesVisited: counts.visited, timesBucketListed: counts.bucketList }))
      .sort((a, b) => b.timesVisited - a.timesVisited);
  }

  // Keep backward compatibility with existing dashboard
  const popularStates = popularItems['states'] || [];
  const popularCountries = popularItems['countries'] || [];

  return {
    overview: {
      totalUsers,
      usersWithSelections,
      usersTrackingStates,
      usersTrackingCountries,
    },
    categoryStats,
    popularStates,
    popularCountries,
    popularItems,
  };
}
