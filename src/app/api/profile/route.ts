import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isReservedUsername } from '@/lib/constants/reservedUsernames';

/**
 * GET /api/profile
 * Get the current user's profile
 */
export async function GET() {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PUT /api/profile
 * Update the current user's profile
 */
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { full_name, username, bio, is_public } = body;

    // Validate username if provided
    if (username !== undefined && username !== null && username !== '') {
      // Check username format
      if (username.length < 3) {
        return NextResponse.json(
          { error: 'Username must be at least 3 characters' },
          { status: 400 }
        );
      }
      if (username.length > 20) {
        return NextResponse.json(
          { error: 'Username must be 20 characters or less' },
          { status: 400 }
        );
      }
      if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return NextResponse.json(
          { error: 'Username can only contain letters, numbers, and underscores' },
          { status: 400 }
        );
      }

      // Check for reserved usernames
      if (isReservedUsername(username)) {
        return NextResponse.json(
          { error: 'This username is reserved and cannot be used' },
          { status: 400 }
        );
      }
      // Note: We rely on the database unique constraint to prevent duplicate usernames.
      // This avoids a TOCTOU race condition where another user could claim the username
      // between a pre-check and the actual update. The constraint error is handled below.
    }

    // Build update object
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (full_name !== undefined) updateData.full_name = full_name || null;
    // Store username as lowercase to match the lower(username) index
    if (username !== undefined) updateData.username = username ? username.toLowerCase() : null;
    if (bio !== undefined) updateData.bio = bio || null;
    if (is_public !== undefined) updateData.is_public = is_public;

    const { data: profile, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      // Handle unique constraint violation (race condition protection)
      // Postgres error code 23505 = unique_violation
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Username is already taken' },
          { status: 400 }
        );
      }
      console.error('Error updating profile:', error);
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
