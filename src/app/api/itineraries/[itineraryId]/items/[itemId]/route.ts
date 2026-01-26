import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { UpdateItineraryItemInput } from '@/lib/types';
import { sanitizeText } from '@/lib/serverUtils';

interface RouteParams {
  params: Promise<{ itineraryId: string; itemId: string }>;
}

/**
 * PUT /api/itineraries/[itineraryId]/items/[itemId]
 * Update an itinerary item
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { itineraryId, itemId } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: UpdateItineraryItemInput = await request.json();

    if (body.notes !== undefined && body.notes.length > 500) {
      return NextResponse.json({ error: 'Notes must be 500 characters or less' }, { status: 400 });
    }

    // Build update object with sanitized inputs to prevent XSS
    const updateData: Record<string, unknown> = {};
    if (body.notes !== undefined) updateData.notes = sanitizeText(body.notes);
    if (body.sort_order !== undefined) updateData.sort_order = body.sort_order;
    if (body.day_number !== undefined) updateData.day_number = body.day_number || null;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('itinerary_items')
      .update(updateData)
      .eq('id', itemId)
      .eq('itinerary_id', itineraryId)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Item not found or access denied' }, { status: 404 });
      }
      console.error('Error updating itinerary item:', error);
      return NextResponse.json({ error: 'Failed to update itinerary item' }, { status: 500 });
    }

    return NextResponse.json({ item: data });
  } catch (error) {
    console.error('Update itinerary item API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/itineraries/[itineraryId]/items/[itemId]
 * Remove an item from an itinerary
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { itineraryId, itemId } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { error } = await supabase
      .from('itinerary_items')
      .delete()
      .eq('id', itemId)
      .eq('itinerary_id', itineraryId);

    if (error) {
      console.error('Error deleting itinerary item:', error);
      return NextResponse.json({ error: 'Failed to delete itinerary item' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete itinerary item API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
