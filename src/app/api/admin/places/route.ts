import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

interface PlaceOverride {
  name?: string;
  lat?: number;
  lng?: number;
  website?: string;
  state?: string;
  country?: string;
  region?: string;
}

// GET - Fetch all overrides
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: adminCheck } = await supabase
      .from('admin_emails')
      .select('email')
      .eq('email', user.email?.toLowerCase())
      .single();

    if (!adminCheck) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { data: overrides, error } = await supabase
      .from('place_overrides')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ overrides: overrides || [] });
  } catch (error) {
    console.error('Error fetching place overrides:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create or update an override
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: adminCheck } = await supabase
      .from('admin_emails')
      .select('email')
      .eq('email', user.email?.toLowerCase())
      .single();

    if (!adminCheck) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { category, placeId, overrides, notes } = body as {
      category: string;
      placeId: string;
      overrides: PlaceOverride;
      notes?: string;
    };

    if (!category || !placeId) {
      return NextResponse.json({ error: 'Category and placeId are required' }, { status: 400 });
    }

    const adminClient = createAdminClient();

    // Upsert the override
    const { data, error } = await adminClient
      .from('place_overrides')
      .upsert({
        category,
        place_id: placeId,
        overrides,
        notes: notes || null,
        updated_by: user.email,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'category,place_id',
      })
      .select()
      .single();

    if (error) throw error;

    // Log the action
    await adminClient.from('admin_logs').insert({
      admin_email: user.email,
      action: 'update_place',
      target_type: 'place',
      target_id: `${category}:${placeId}`,
      details: { overrides, notes },
    });

    return NextResponse.json({ override: data });
  } catch (error) {
    console.error('Error saving place override:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Remove an override
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: adminCheck } = await supabase
      .from('admin_emails')
      .select('email')
      .eq('email', user.email?.toLowerCase())
      .single();

    if (!adminCheck) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { category, placeId } = body as { category: string; placeId: string };

    if (!category || !placeId) {
      return NextResponse.json({ error: 'Category and placeId are required' }, { status: 400 });
    }

    const adminClient = createAdminClient();

    const { error } = await adminClient
      .from('place_overrides')
      .delete()
      .eq('category', category)
      .eq('place_id', placeId);

    if (error) throw error;

    // Log the action
    await adminClient.from('admin_logs').insert({
      admin_email: user.email,
      action: 'delete_place_override',
      target_type: 'place',
      target_id: `${category}:${placeId}`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting place override:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
