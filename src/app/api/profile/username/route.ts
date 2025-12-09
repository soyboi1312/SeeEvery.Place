import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/profile/username?username=xxx
 * Check if a username is available
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    // Validate username format
    if (username.length < 3) {
      return NextResponse.json({
        available: false,
        reason: 'Username must be at least 3 characters',
      });
    }

    if (username.length > 20) {
      return NextResponse.json({
        available: false,
        reason: 'Username must be 20 characters or less',
      });
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return NextResponse.json({
        available: false,
        reason: 'Username can only contain letters, numbers, and underscores',
      });
    }

    const supabase = await createClient();

    // Check if username is taken (case-insensitive)
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .ilike('username', username)
      .single();

    return NextResponse.json({
      available: !existingUser,
      reason: existingUser ? 'Username is already taken' : null,
    });
  } catch (error) {
    console.error('Error checking username:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
