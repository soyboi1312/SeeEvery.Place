import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { SupabaseClient } from '@supabase/supabase-js';

interface RouteParams {
  params: Promise<{ itineraryId: string }>;
}

/**
 * Helper to verify the current user owns the itinerary
 * Returns the owner_id if found, or null if not found/error
 */
async function verifyItineraryOwnership(
  supabase: SupabaseClient,
  itineraryId: string,
  userId: string
): Promise<{ isOwner: boolean; notFound: boolean }> {
  const { data: itinerary, error } = await supabase
    .from('itineraries')
    .select('owner_id')
    .eq('id', itineraryId)
    .single();

  if (error || !itinerary) {
    return { isOwner: false, notFound: true };
  }

  return { isOwner: itinerary.owner_id === userId, notFound: false };
}

/**
 * GET /api/itineraries/[itineraryId]/collaborators
 * Get all collaborators for an itinerary
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { itineraryId } = await params;
    const supabase = await createClient();

    // Get collaborators with profile info
    const { data, error } = await supabase
      .from('itinerary_collaborators')
      .select(`
        *,
        user:profiles!itinerary_collaborators_user_id_fkey(id, username, display_name)
      `)
      .eq('itinerary_id', itineraryId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching collaborators:', error);
      // Fallback to simple query without join
      const { data: simpleData, error: simpleError } = await supabase
        .from('itinerary_collaborators')
        .select('*')
        .eq('itinerary_id', itineraryId)
        .order('created_at', { ascending: true });

      if (simpleError) {
        return NextResponse.json({ error: simpleError.message }, { status: 500 });
      }

      return NextResponse.json({ collaborators: simpleData || [] });
    }

    return NextResponse.json({ collaborators: data || [] });
  } catch (error) {
    console.error('Get collaborators API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/itineraries/[itineraryId]/collaborators
 * Add a collaborator to an itinerary
 * Body: { userId: string, role?: 'editor' | 'viewer' }
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { itineraryId } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user owns the itinerary
    const { isOwner, notFound } = await verifyItineraryOwnership(supabase, itineraryId, user.id);
    if (notFound) {
      return NextResponse.json({ error: 'Itinerary not found' }, { status: 404 });
    }
    if (!isOwner) {
      return NextResponse.json({ error: 'Only the owner can manage collaborators' }, { status: 403 });
    }

    const body = await request.json();
    const { userId, role = 'editor' } = body;

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    if (!['editor', 'viewer'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role. Must be "editor" or "viewer"' }, { status: 400 });
    }

    // Cannot add yourself as collaborator
    if (userId === user.id) {
      return NextResponse.json({ error: 'Cannot add yourself as a collaborator' }, { status: 400 });
    }

    // Check if user exists
    const { data: targetUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { data, error } = await supabase
      .from('itinerary_collaborators')
      .insert({
        itinerary_id: itineraryId,
        user_id: userId,
        role,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding collaborator:', error);
      if (error.code === '23505') {
        return NextResponse.json({ error: 'User is already a collaborator' }, { status: 409 });
      }
      return NextResponse.json({ error: 'Failed to add collaborator' }, { status: 500 });
    }

    return NextResponse.json({ collaborator: data }, { status: 201 });
  } catch (error) {
    console.error('Add collaborator API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/itineraries/[itineraryId]/collaborators
 * Remove a collaborator from an itinerary
 * Body: { userId: string }
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { itineraryId } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user owns the itinerary
    const { isOwner, notFound } = await verifyItineraryOwnership(supabase, itineraryId, user.id);
    if (notFound) {
      return NextResponse.json({ error: 'Itinerary not found' }, { status: 404 });
    }
    if (!isOwner) {
      return NextResponse.json({ error: 'Only the owner can manage collaborators' }, { status: 403 });
    }

    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('itinerary_collaborators')
      .delete()
      .eq('itinerary_id', itineraryId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error removing collaborator:', error);
      return NextResponse.json({ error: 'Failed to remove collaborator' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Remove collaborator API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PUT /api/itineraries/[itineraryId]/collaborators
 * Update a collaborator's role
 * Body: { userId: string, role: 'editor' | 'viewer' }
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { itineraryId } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user owns the itinerary
    const { isOwner, notFound } = await verifyItineraryOwnership(supabase, itineraryId, user.id);
    if (notFound) {
      return NextResponse.json({ error: 'Itinerary not found' }, { status: 404 });
    }
    if (!isOwner) {
      return NextResponse.json({ error: 'Only the owner can manage collaborators' }, { status: 403 });
    }

    const body = await request.json();
    const { userId, role } = body;

    if (!userId || !role) {
      return NextResponse.json({ error: 'userId and role are required' }, { status: 400 });
    }

    if (!['editor', 'viewer'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role. Must be "editor" or "viewer"' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('itinerary_collaborators')
      .update({ role })
      .eq('itinerary_id', itineraryId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating collaborator role:', error);
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Collaborator not found' }, { status: 404 });
      }
      return NextResponse.json({ error: 'Failed to update collaborator role' }, { status: 500 });
    }

    return NextResponse.json({ collaborator: data });
  } catch (error) {
    console.error('Update collaborator API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
