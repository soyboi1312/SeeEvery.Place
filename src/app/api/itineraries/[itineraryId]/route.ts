import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { UpdateItineraryInput } from '@/lib/types';

interface RouteParams {
  params: Promise<{ itineraryId: string }>;
}

/**
 * GET /api/itineraries/[itineraryId]
 * Get a single itinerary with full details
 * Uses RPC to fetch itinerary with owner details and user_role in a single query
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { itineraryId } = await params;
    const supabase = await createClient();

    // Use RPC to get itinerary with owner details and calculated user_role in one shot
    // This reduces 2-3 database calls to a single call
    const { data, error } = await supabase
      .rpc('get_itinerary_details', {
        itinerary_uuid: itineraryId
      });

    if (error) {
      console.error('Error fetching itinerary:', error);
      return NextResponse.json({ error: 'Failed to fetch itinerary' }, { status: 500 });
    }

    // RPC returns an array (rows), take the first one
    const itinerary = Array.isArray(data) ? data[0] : data;

    if (!itinerary) {
      return NextResponse.json({ error: 'Itinerary not found' }, { status: 404 });
    }

    return NextResponse.json({ itinerary });
  } catch (error) {
    console.error('Get itinerary API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PUT /api/itineraries/[itineraryId]
 * Update an itinerary
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { itineraryId } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: UpdateItineraryInput = await request.json();

    // Validate inputs
    if (body.title !== undefined) {
      if (body.title.trim().length === 0) {
        return NextResponse.json({ error: 'Title cannot be empty' }, { status: 400 });
      }
      if (body.title.length > 100) {
        return NextResponse.json({ error: 'Title must be 100 characters or less' }, { status: 400 });
      }
    }

    if (body.description !== undefined && body.description.length > 500) {
      return NextResponse.json({ error: 'Description must be 500 characters or less' }, { status: 400 });
    }

    // Build update object
    const updateData: Record<string, unknown> = {};
    if (body.title !== undefined) updateData.title = body.title.trim();
    if (body.description !== undefined) updateData.description = body.description?.trim() || null;
    if (body.start_date !== undefined) updateData.start_date = body.start_date || null;
    if (body.end_date !== undefined) updateData.end_date = body.end_date || null;
    if (body.is_public !== undefined) updateData.is_public = body.is_public;
    if (body.cover_image_url !== undefined) updateData.cover_image_url = body.cover_image_url || null;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('itineraries')
      .update(updateData)
      .eq('id', itineraryId)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Itinerary not found or access denied' }, { status: 404 });
      }
      console.error('Error updating itinerary:', error);
      return NextResponse.json({ error: 'Failed to update itinerary' }, { status: 500 });
    }

    return NextResponse.json({ itinerary: data });
  } catch (error) {
    console.error('Update itinerary API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/itineraries/[itineraryId]
 * Delete an itinerary (owner only)
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { itineraryId } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user owns the itinerary before deletion
    const { data: itinerary, error: fetchError } = await supabase
      .from('itineraries')
      .select('owner_id')
      .eq('id', itineraryId)
      .single();

    if (fetchError || !itinerary) {
      return NextResponse.json({ error: 'Itinerary not found' }, { status: 404 });
    }

    if (itinerary.owner_id !== user.id) {
      return NextResponse.json({ error: 'Only the owner can delete this itinerary' }, { status: 403 });
    }

    const { error } = await supabase
      .from('itineraries')
      .delete()
      .eq('id', itineraryId);

    if (error) {
      console.error('Error deleting itinerary:', error);
      return NextResponse.json({ error: 'Failed to delete itinerary' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete itinerary API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
