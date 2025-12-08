import { createClient, createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function DELETE() {
  const supabase = await createClient();

  // Get the current user (verify they're authenticated)
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

    // Sign out the user first (invalidates their session)
    await supabase.auth.signOut();

    // Use admin client to fully delete user from auth.users
    // This requires SUPABASE_SERVICE_ROLE_KEY env variable
    try {
      const adminClient = createAdminClient();
      const { error: deleteAuthError } = await adminClient.auth.admin.deleteUser(user.id);

      if (deleteAuthError) {
        console.error('Error deleting user from auth:', deleteAuthError);
        // User data is deleted and they're signed out, so partial success
      }
    } catch (adminError) {
      // Service role key may not be configured - log and continue
      console.warn('Admin client not available for full user deletion:', adminError);
      // User is still signed out and their data is deleted
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Account deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    );
  }
}
