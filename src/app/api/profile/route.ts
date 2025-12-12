import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Reserved usernames that could conflict with routes or have special meaning
const RESERVED_USERNAMES = new Set([
  // Route segments
  'admin', 'api', 'auth', 'login', 'logout', 'signup', 'register',
  'settings', 'profile', 'dashboard', 'edit', 'new', 'create',
  // File extensions / formats
  'json', 'xml', 'rss', 'atom', 'sitemap', 'robots',
  // Common reserved words
  'null', 'undefined', 'true', 'false', 'system', 'support',
  'help', 'about', 'contact', 'privacy', 'terms', 'legal',
  // App-specific
  'map', 'maps', 'share', 'explore', 'discover', 'search',
  'suggestions', 'suggest', 'feedback', 'report',
]);

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
      return NextResponse.json({ error: error.message }, { status: 500 });
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
      if (RESERVED_USERNAMES.has(username.toLowerCase())) {
        return NextResponse.json(
          { error: 'This username is reserved and cannot be used' },
          { status: 400 }
        );
      }

      // Check if username is available (case-insensitive)
      // This is for a better UI error message; the DB constraint is the hard stop
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .ilike('username', username)
        .neq('id', user.id)
        .single();

      if (existingUser) {
        return NextResponse.json(
          { error: 'Username is already taken' },
          { status: 400 }
        );
      }
    }

    // Build update object
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (full_name !== undefined) updateData.full_name = full_name || null;
    if (username !== undefined) updateData.username = username || null;
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
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
