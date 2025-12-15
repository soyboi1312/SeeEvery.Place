import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/itineraries/[id]/items
 * Get all items in an itinerary
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data, error } = await supabase.rpc('get_itinerary_items', {
      p_itinerary_id: id,
    });

    if (error) {
      console.error('Error fetching itinerary items:', error);
      if (error.message.includes('Access denied')) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ items: data || [] });
  } catch (error) {
    console.error('Itinerary items GET API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/itineraries/[id]/items
 * Add item to itinerary
 * Body: { category, place_id, place_name, notes?, day_number? }
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { category, place_id, place_name, notes, day_number } = body;

    if (!category || !place_id || !place_name) {
      return NextResponse.json(
        { error: 'category, place_id, and place_name are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.rpc('add_itinerary_item', {
      p_itinerary_id: id,
      p_category: category,
      p_place_id: place_id,
      p_place_name: place_name,
      p_notes: notes || null,
      p_day_number: day_number || null,
    });

    if (error) {
      console.error('Error adding itinerary item:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (data?.error) {
      return NextResponse.json({ error: data.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, item_id: data?.item_id });
  } catch (error) {
    console.error('Itinerary items POST API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/itineraries/[id]/items
 * Remove item from itinerary
 * Body: { item_id }
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { item_id } = body;

    if (!item_id) {
      return NextResponse.json({ error: 'item_id is required' }, { status: 400 });
    }

    const { data, error } = await supabase.rpc('remove_itinerary_item', {
      p_item_id: item_id,
    });

    if (error) {
      console.error('Error removing itinerary item:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (data?.error) {
      return NextResponse.json({ error: data.error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Itinerary items DELETE API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
