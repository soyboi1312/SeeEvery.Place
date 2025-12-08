import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

interface SelectionItem {
  id: string;
  status: 'visited' | 'bucketList' | 'unvisited';
  deleted?: boolean;
}

interface UserSelectionsRow {
  user_id: string;
  selections: Record<string, SelectionItem[]>;
}

interface AuthUser {
  id: string;
  email?: string;
  created_at: string;
  last_sign_in_at?: string;
}

export async function GET(request: NextRequest) {
  try {
    // Parse pagination parameters
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50', 10)));

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

    // Fetch users with pagination (Supabase uses 1-indexed pages)
    const { data: authUsers, error: authError } = await adminClient.auth.admin.listUsers({
      page,
      perPage: limit,
    });

    if (authError) {
      console.error('Error fetching auth users:', authError);
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }

    // Get user IDs from the current page to fetch only relevant selections
    const userIds = authUsers.users.map((u: AuthUser) => u.id);

    // Fetch selections only for users on this page (optimized query)
    const { data: selections, error: selectionsError } = await adminClient
      .from('user_selections')
      .select('user_id, selections')
      .in('user_id', userIds);

    if (selectionsError) {
      console.error('Error fetching selections:', selectionsError);
    }

    // Create a map of user_id to selection stats
    const selectionStats = new Map<string, { categories_count: number; total_visited: number; total_bucket_list: number }>();

    for (const row of (selections || []) as UserSelectionsRow[]) {
      const userSelections = row.selections || {};
      let categoriesCount = 0;
      let totalVisited = 0;
      let totalBucketList = 0;

      for (const [, items] of Object.entries(userSelections)) {
        const activeItems = (items as SelectionItem[]).filter(item => !item.deleted);
        if (activeItems.length > 0) {
          categoriesCount++;
        }

        for (const item of activeItems) {
          if (item.status === 'visited') {
            totalVisited++;
          } else if (item.status === 'bucketList') {
            totalBucketList++;
          }
        }
      }

      selectionStats.set(row.user_id, {
        categories_count: categoriesCount,
        total_visited: totalVisited,
        total_bucket_list: totalBucketList,
      });
    }

    // Combine auth users with their selection stats
    // NOTE: Users are returned in Supabase's default order (by creation time, oldest first).
    // Supabase's listUsers API does not support custom sorting, so we preserve the API's order.
    // Client-side sorting would only affect the current page, not the full dataset.
    const users = authUsers.users.map((authUser: AuthUser) => {
      const stats = selectionStats.get(authUser.id) || {
        categories_count: 0,
        total_visited: 0,
        total_bucket_list: 0,
      };

      return {
        id: authUser.id,
        email: authUser.email || 'Unknown',
        created_at: authUser.created_at,
        last_sign_in_at: authUser.last_sign_in_at || null,
        ...stats,
      };
    });

    // Calculate total pages (Supabase doesn't return total count directly)
    // We approximate by checking if we got a full page
    const hasMore = users.length === limit;

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        count: users.length,
        hasMore,
      },
    });
  } catch (error) {
    console.error('Users API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Get user ID from request body
    const { userId } = await request.json();

    if (!userId || typeof userId !== 'string') {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Verify admin access using the user's session
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Prevent self-deletion
    if (user.id === userId) {
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
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

    // Use admin client to delete user
    const adminClient = createAdminClient();

    // First, delete user's selections data
    const { error: selectionsError } = await adminClient
      .from('user_selections')
      .delete()
      .eq('user_id', userId);

    if (selectionsError) {
      console.error('Error deleting user selections:', selectionsError);
      // Continue with user deletion even if selections deletion fails
    }

    // Delete the user from auth
    const { error: deleteError } = await adminClient.auth.admin.deleteUser(userId);

    if (deleteError) {
      console.error('Error deleting user:', deleteError);
      return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
