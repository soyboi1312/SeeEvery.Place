import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/banners - Get active banners for display
export async function GET() {
  try {
    const supabase = await createClient();
    const now = new Date().toISOString();

    // Fetch active banners
    const { data: banners, error } = await supabase
      .from('system_banners')
      .select('id, message, type, link_text, link_url')
      .eq('is_active', true)
      .lte('starts_at', now)
      .or(`ends_at.is.null,ends_at.gt.${now}`)
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Error fetching banners:', error);
      return NextResponse.json({ banners: [] });
    }

    return NextResponse.json({ banners: banners || [] });
  } catch (error) {
    console.error('Banners API error:', error);
    return NextResponse.json({ banners: [] });
  }
}
