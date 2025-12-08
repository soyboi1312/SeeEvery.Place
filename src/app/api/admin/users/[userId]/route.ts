import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { ALL_CATEGORIES, Category, Selection } from '@/lib/types';

interface SelectionItem {
  id: string;
  status: 'visited' | 'bucketList' | 'unvisited';
  deleted?: boolean;
}

interface CategoryStats {
  category: Category;
  visited: number;
  bucketList: number;
  total: number;
}

interface UserDetailResponse {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  selections: Record<string, Selection[]>;
  categoryStats: CategoryStats[];
  totalVisited: number;
  totalBucketList: number;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    if (!userId || typeof userId !== 'string') {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

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

    // Use admin client to bypass RLS
    const adminClient = createAdminClient();

    // Get user auth data
    const { data: userData, error: userError } = await adminClient.auth.admin.getUserById(userId);

    if (userError || !userData.user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get user selections
    const { data: selectionsData, error: selectionsError } = await adminClient
      .from('user_selections')
      .select('selections')
      .eq('user_id', userId)
      .single();

    if (selectionsError && selectionsError.code !== 'PGRST116') {
      console.error('Error fetching selections:', selectionsError);
    }

    const selections = (selectionsData?.selections || {}) as Record<string, SelectionItem[]>;

    // Calculate stats for each category
    const categoryStats: CategoryStats[] = [];
    let totalVisited = 0;
    let totalBucketList = 0;

    for (const category of ALL_CATEGORIES) {
      const items = selections[category] || [];
      const activeItems = items.filter(item => !item.deleted);

      const visited = activeItems.filter(item => item.status === 'visited').length;
      const bucketList = activeItems.filter(item => item.status === 'bucketList').length;

      totalVisited += visited;
      totalBucketList += bucketList;

      if (visited > 0 || bucketList > 0) {
        categoryStats.push({
          category,
          visited,
          bucketList,
          total: visited + bucketList,
        });
      }
    }

    // Sort by total tracked items descending
    categoryStats.sort((a, b) => b.total - a.total);

    const response: UserDetailResponse = {
      id: userData.user.id,
      email: userData.user.email || 'Unknown',
      created_at: userData.user.created_at,
      last_sign_in_at: userData.user.last_sign_in_at || null,
      selections,
      categoryStats,
      totalVisited,
      totalBucketList,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('User detail API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
