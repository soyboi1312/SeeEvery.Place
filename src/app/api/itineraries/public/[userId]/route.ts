import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface RouteParams {
  params: Promise<{ userId: string }>;
}

/**
 * GET /api/itineraries/public/[userId]
 * Get public itineraries for a user (for profile pages)
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await params;
    const supabase = await createClient();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Get public itineraries for the user
    const { data, error } = await supabase
      .from('itineraries')
      .select('*')
      .eq('owner_id', userId)
      .eq('is_public', true)
      .order('updated_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching public itineraries:', error);
      return NextResponse.json({ error: 'Failed to fetch public itineraries' }, { status: 500 });
    }

    return NextResponse.json({ itineraries: data || [] });
  } catch (error) {
    console.error('Get public itineraries API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
