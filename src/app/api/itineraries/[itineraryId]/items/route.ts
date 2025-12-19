import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { AddItineraryItemInput, ALL_CATEGORIES } from '@/lib/types';

interface RouteParams {
  params: Promise<{ itineraryId: string }>;
}

/**
 * GET /api/itineraries/[itineraryId]/items
 * Get all items in an itinerary
 * Uses RPC to include added_by_username for collaborative trips
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { itineraryId } = await params;
    const supabase = await createClient();

    // Use RPC to get items with "added_by_username" join
    // This is useful for collaborative trips to see who added what
    const { data, error } = await supabase
      .rpc('get_itinerary_items', {
        itinerary_uuid: itineraryId
      });

    if (error) {
      console.error('Error fetching itinerary items:', error);
      return NextResponse.json({ error: 'Failed to fetch itinerary items' }, { status: 500 });
    }

    return NextResponse.json({ items: data || [] });
  } catch (error) {
    console.error('Get itinerary items API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/itineraries/[itineraryId]/items
 * Add an item to an itinerary
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { itineraryId } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: Omit<AddItineraryItemInput, 'itinerary_id'> = await request.json();

    // Validate required fields
    if (!body.category || !body.place_id || !body.place_name) {
      return NextResponse.json({ error: 'category, place_id, and place_name are required' }, { status: 400 });
    }

    // Validate category
    if (!ALL_CATEGORIES.includes(body.category)) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }

    if (body.place_name.length > 200) {
      return NextResponse.json({ error: 'Place name must be 200 characters or less' }, { status: 400 });
    }

    if (body.notes && body.notes.length > 500) {
      return NextResponse.json({ error: 'Notes must be 500 characters or less' }, { status: 400 });
    }

    // Get the next sort order
    const { data: existingItems } = await supabase
      .from('itinerary_items')
      .select('sort_order')
      .eq('itinerary_id', itineraryId)
      .order('sort_order', { ascending: false })
      .limit(1);

    const nextSortOrder = (existingItems?.[0]?.sort_order ?? -1) + 1;

    const { data, error } = await supabase
      .from('itinerary_items')
      .insert({
        itinerary_id: itineraryId,
        category: body.category,
        place_id: body.place_id,
        place_name: body.place_name.trim(),
        notes: body.notes?.trim() || null,
        sort_order: body.sort_order ?? nextSortOrder,
        day_number: body.day_number || null,
        added_by: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding itinerary item:', error);
      if (error.code === '42501') {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }
      return NextResponse.json({ error: 'Failed to add itinerary item' }, { status: 500 });
    }

    return NextResponse.json({ item: data }, { status: 201 });
  } catch (error) {
    console.error('Add itinerary item API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
