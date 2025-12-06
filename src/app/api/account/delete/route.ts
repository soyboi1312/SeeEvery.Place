import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function DELETE() {
  const supabase = await createClient();

  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    // Delete user's selections from the database
    const { error: selectionsError } = await supabase
      .from('user_selections')
      .delete()
      .eq('user_id', user.id);

    if (selectionsError) {
      console.error('Error deleting user selections:', selectionsError);
      // Continue anyway - we still want to delete the account
    }

    // Delete user's suggestions (optional - you might want to keep these for data integrity)
    // Uncomment if you want to delete suggestions too:
    // await supabase
    //   .from('suggestions')
    //   .delete()
    //   .eq('user_id', user.id);

    // Sign out the user (this invalidates their session)
    await supabase.auth.signOut();

    // Note: Deleting from auth.users requires admin privileges
    // For now, we delete their data and sign them out
    // The user record in auth.users will remain but be effectively orphaned
    // To fully delete, you'd need a Supabase Edge Function with service role key

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Account deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    );
  }
}
