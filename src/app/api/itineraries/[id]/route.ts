import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/itineraries/[id]
 * Get itinerary details
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data, error } = await supabase.rpc('get_itinerary_details', {
      p_itinerary_id: id,
    });

    if (error) {
      console.error('Error fetching itinerary:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Itinerary not found' }, { status: 404 });
    }

    return NextResponse.json({ itinerary: data[0] });
  } catch (error) {
    console.error('Itinerary GET API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PATCH /api/itineraries/[id]
 * Update itinerary
 * Body: { title?, description?, start_date?, end_date?, is_public?, status? }
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, start_date, end_date, is_public, status, cover_image_url } = body;

    // Build update object with only provided fields
    const updates: Record<string, unknown> = {};
    if (title !== undefined) updates.title = title.trim();
    if (description !== undefined) updates.description = description?.trim() || null;
    if (start_date !== undefined) updates.start_date = start_date || null;
    if (end_date !== undefined) updates.end_date = end_date || null;
    if (is_public !== undefined) updates.is_public = is_public;
    if (status !== undefined) updates.status = status;
    if (cover_image_url !== undefined) updates.cover_image_url = cover_image_url || null;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No updates provided' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('itineraries')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating itinerary:', error);
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Itinerary not found or permission denied' }, { status: 404 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, itinerary: data });
  } catch (error) {
    console.error('Itinerary PATCH API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/itineraries/[id]
 * Delete itinerary (only owner)
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { error } = await supabase
      .from('itineraries')
      .delete()
      .eq('id', id)
      .eq('owner_id', user.id);

    if (error) {
      console.error('Error deleting itinerary:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Itinerary DELETE API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
