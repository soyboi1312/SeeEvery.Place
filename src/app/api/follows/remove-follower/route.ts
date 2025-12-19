import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * DELETE /api/follows/remove-follower
 * Remove a follower (force someone to unfollow you)
 * Body: { followerId: string }
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { followerId } = body;

    if (!followerId) {
      return NextResponse.json({ error: 'followerId is required' }, { status: 400 });
    }

    // Delete the follow where the current user is the one being followed
    const { error } = await supabase
      .from('follows')
      .delete()
      .eq('follower_id', followerId)
      .eq('following_id', user.id);

    if (error) {
      console.error('Error removing follower:', error);
      return NextResponse.json({ error: 'Failed to remove follower' }, { status: 500 });
    }

    // Update follower count on current user's profile
    const { error: countError } = await supabase.rpc('update_follower_counts', {
      user_a: user.id,
      user_b: followerId,
    });

    if (countError) {
      console.error('Error updating follower counts:', countError);
      // Don't fail the request, counts will be recalculated
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Remove follower API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
