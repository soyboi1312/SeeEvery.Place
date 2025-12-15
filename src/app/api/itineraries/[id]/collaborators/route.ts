import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/itineraries/[id]/collaborators
 * Get all collaborators for an itinerary
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data, error } = await supabase.rpc('get_itinerary_collaborators', {
      p_itinerary_id: id,
    });

    if (error) {
      console.error('Error fetching collaborators:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ collaborators: data || [] });
  } catch (error) {
    console.error('Collaborators GET API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/itineraries/[id]/collaborators
 * Invite a collaborator
 * Body: { user_id, role? }
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
    const { user_id, role } = body;

    if (!user_id) {
      return NextResponse.json({ error: 'user_id is required' }, { status: 400 });
    }

    const { data, error } = await supabase.rpc('invite_itinerary_collaborator', {
      p_itinerary_id: id,
      p_user_id: user_id,
      p_role: role || 'editor',
    });

    if (error) {
      console.error('Error inviting collaborator:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (data?.error) {
      return NextResponse.json({ error: data.error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Collaborators POST API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/itineraries/[id]/collaborators
 * Remove a collaborator
 * Body: { user_id }
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { user_id } = body;

    if (!user_id) {
      return NextResponse.json({ error: 'user_id is required' }, { status: 400 });
    }

    const { data, error } = await supabase.rpc('remove_itinerary_collaborator', {
      p_itinerary_id: id,
      p_user_id: user_id,
    });

    if (error) {
      console.error('Error removing collaborator:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (data?.error) {
      return NextResponse.json({ error: data.error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Collaborators DELETE API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
