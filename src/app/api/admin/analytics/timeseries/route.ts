import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

interface TimeSeriesPoint {
  date: string;
  newUsers: number;
  itemsTracked: number;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30', 10);

    // Verify admin access
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: adminCheck } = await supabase
      .from('admin_emails')
      .select('email')
      .eq('email', user.email?.toLowerCase())
      .single();

    if (!adminCheck) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const adminClient = createAdminClient();

    // Get date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get all auth users
    const { data: authData } = await adminClient.auth.admin.listUsers({
      page: 1,
      perPage: 10000, // Get all users
    });

    // Get all user selections for activity tracking
    const { data: selections } = await adminClient
      .from('user_selections')
      .select('user_id, selections, updated_at');

    // Initialize date buckets
    const dateBuckets: Record<string, { newUsers: number; itemsTracked: number }> = {};
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateKey = d.toISOString().split('T')[0];
      dateBuckets[dateKey] = { newUsers: 0, itemsTracked: 0 };
    }

    // Count new users per day
    if (authData?.users) {
      for (const authUser of authData.users) {
        const createdDate = new Date(authUser.created_at).toISOString().split('T')[0];
        if (dateBuckets[createdDate] !== undefined) {
          dateBuckets[createdDate].newUsers++;
        }
      }
    }

    // Count items tracked per day based on selection updates
    if (selections) {
      for (const row of selections) {
        const updatedDate = row.updated_at
          ? new Date(row.updated_at).toISOString().split('T')[0]
          : null;

        if (updatedDate && dateBuckets[updatedDate] !== undefined) {
          // Count total items in this user's selections
          const userSelections = row.selections as Record<string, { deleted?: boolean }[]>;
          let itemCount = 0;
          for (const [, items] of Object.entries(userSelections || {})) {
            itemCount += (items || []).filter(item => !item.deleted).length;
          }
          dateBuckets[updatedDate].itemsTracked += itemCount;
        }
      }
    }

    // Convert to array
    const timeseries: TimeSeriesPoint[] = Object.entries(dateBuckets)
      .map(([date, data]) => ({
        date,
        newUsers: data.newUsers,
        itemsTracked: data.itemsTracked,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Calculate totals
    const totals = {
      newUsers: timeseries.reduce((sum, d) => sum + d.newUsers, 0),
      itemsTracked: timeseries.reduce((sum, d) => sum + d.itemsTracked, 0),
    };

    return NextResponse.json({
      timeseries,
      totals,
      days,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    });
  } catch (error) {
    console.error('Time series API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
