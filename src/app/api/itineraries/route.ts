import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { CreateItineraryInput } from '@/lib/types';

/**
 * GET /api/itineraries
 * Get all itineraries for the current user (owned + collaborating)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Get itineraries owned by user
    const { data: ownedData, error: ownedError } = await supabase
      .from('itineraries')
      .select('*')
      .eq('owner_id', user.id)
      .order('updated_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (ownedError) {
      console.error('Error fetching owned itineraries:', ownedError);
      return NextResponse.json({ error: ownedError.message }, { status: 500 });
    }

    // Get itineraries where user is a collaborator
    const { data: collabData } = await supabase
      .from('itinerary_collaborators')
      .select('itinerary_id')
      .eq('user_id', user.id);

    let collaboratedItineraries: typeof ownedData = [];
    if (collabData && collabData.length > 0) {
      const collabIds = collabData.map(c => c.itinerary_id);
      const { data: collabItineraries } = await supabase
        .from('itineraries')
        .select('*')
        .in('id', collabIds)
        .order('updated_at', { ascending: false });

      collaboratedItineraries = collabItineraries || [];
    }

    // Merge and deduplicate
    const allItineraries = [...(ownedData || [])];
    const ownedIds = new Set(allItineraries.map(i => i.id));
    for (const collab of collaboratedItineraries) {
      if (!ownedIds.has(collab.id)) {
        allItineraries.push(collab);
      }
    }

    // Sort by updated_at
    allItineraries.sort((a, b) =>
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );

    return NextResponse.json({ itineraries: allItineraries });
  } catch (error) {
    console.error('Itineraries API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/itineraries
 * Create a new itinerary
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: CreateItineraryInput = await request.json();

    if (!body.title || body.title.trim().length === 0) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    if (body.title.length > 100) {
      return NextResponse.json({ error: 'Title must be 100 characters or less' }, { status: 400 });
    }

    if (body.description && body.description.length > 500) {
      return NextResponse.json({ error: 'Description must be 500 characters or less' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('itineraries')
      .insert({
        owner_id: user.id,
        title: body.title.trim(),
        description: body.description?.trim() || null,
        start_date: body.start_date || null,
        end_date: body.end_date || null,
        is_public: body.is_public || false,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating itinerary:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ itinerary: data }, { status: 201 });
  } catch (error) {
    console.error('Create itinerary API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
