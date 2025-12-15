import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/itineraries
 * Get user's itineraries (owned + collaborating)
 * Query params: userId (optional), limit, offset, includeCollaborating
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId') || undefined;
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const includeCollaborating = searchParams.get('includeCollaborating') !== 'false';

    // If viewing someone else's itineraries and not authenticated, only show public
    const targetUserId = userId || (user?.id ?? undefined);

    if (!targetUserId) {
      return NextResponse.json({ error: 'User not specified' }, { status: 400 });
    }

    const { data, error } = await supabase.rpc('get_user_itineraries', {
      target_user_id: userId || null,
      include_collaborating: !userId && includeCollaborating,
      page_limit: limit,
      page_offset: offset,
    });

    if (error) {
      console.error('Error fetching itineraries:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      itineraries: data || [],
      pagination: {
        limit,
        offset,
        hasMore: data?.length === limit,
      },
    });
  } catch (error) {
    console.error('Itineraries GET API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/itineraries
 * Create a new itinerary
 * Body: { title, description?, start_date?, end_date?, is_public?, status? }
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, start_date, end_date, is_public, status } = body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('itineraries')
      .insert({
        owner_id: user.id,
        title: title.trim(),
        description: description?.trim() || null,
        start_date: start_date || null,
        end_date: end_date || null,
        is_public: is_public ?? false,
        status: status || 'draft',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating itinerary:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, itinerary: data });
  } catch (error) {
    console.error('Itineraries POST API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
