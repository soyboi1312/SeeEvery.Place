import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { CreateItineraryInput } from '@/lib/types';

/**
 * GET /api/itineraries
 * Get all itineraries for the current user (owned + collaborating)
 * Uses RPC for correct pagination across both owned and collaborative trips
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    // Cap limit at 50 to prevent abuse
    const rawLimit = parseInt(searchParams.get('limit') || '20');
    const limit = Math.min(Math.max(rawLimit, 1), 50);
    const offset = parseInt(searchParams.get('offset') || '0');

    // Use RPC for correct pagination across owned + collaborative trips
    // The previous implementation broke pagination because offset was only applied
    // to the owned list, causing collaborative trips to reappear on every page
    const { data, error } = await supabase
      .rpc('get_user_itineraries', {
        page_limit: limit,
        page_offset: offset
      });

    if (error) {
      console.error('Error fetching itineraries:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ itineraries: data || [] });
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
