import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/profile/compare
 * Compare current user's travel stats with another user
 * Query params: ?userId=uuid
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const otherUserId = searchParams.get('userId');

    if (!otherUserId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const { data, error } = await supabase.rpc('compare_profiles', {
      p_other_user_id: otherUserId,
    });

    if (error) {
      console.error('Error comparing profiles:', error);
      return NextResponse.json({ error: 'Failed to compare profiles' }, { status: 500 });
    }

    if (data?.error) {
      return NextResponse.json({ error: data.error }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Profile compare API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
