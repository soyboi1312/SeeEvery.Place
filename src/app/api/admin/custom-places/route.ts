import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

// GET - Fetch all custom places
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

    const { data: places, error } = await supabase
      .from('custom_places')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ places: places || [] });
  } catch (error) {
    console.error('Error fetching custom places:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create a new custom place (typically from a suggestion)
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
    const {
      category,
      name,
      lat,
      lng,
      website,
      state,
      country,
      region,
      description,
      suggestionId,
    } = body;

    if (!category || !name) {
      return NextResponse.json({ error: 'Category and name are required' }, { status: 400 });
    }

    // Generate a URL-friendly ID from the name
    const placeId = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 50) + '-' + Date.now().toString(36);

    const adminClient = createAdminClient();

    // Create the custom place
    const { data: place, error } = await adminClient
      .from('custom_places')
      .insert({
        category,
        place_id: placeId,
        name,
        lat: lat || null,
        lng: lng || null,
        website: website || null,
        state: state || null,
        country: country || null,
        region: region || null,
        description: description || null,
        source_suggestion_id: suggestionId || null,
        created_by: user.email,
      })
      .select()
      .single();

    if (error) throw error;

    // If this was from a suggestion, update its status to 'implemented'
    if (suggestionId) {
      await adminClient
        .from('suggestions')
        .update({ status: 'implemented' })
        .eq('id', suggestionId);
    }

    // Log the action
    await adminClient.from('admin_logs').insert({
      admin_email: user.email,
      action: 'create_custom_place',
      target_type: 'custom_place',
      target_id: place.id,
      details: { name, category, suggestionId },
    });

    return NextResponse.json({ place });
  } catch (error) {
    console.error('Error creating custom place:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete a custom place
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
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const adminClient = createAdminClient();

    const { error } = await adminClient
      .from('custom_places')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // Log the action
    await adminClient.from('admin_logs').insert({
      admin_email: user.email,
      action: 'delete_custom_place',
      target_type: 'custom_place',
      target_id: id,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting custom place:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
