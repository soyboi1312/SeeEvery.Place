import { NextRequest, NextResponse } from 'next/server';

const GEO_FILES: Record<string, string> = {
  'countries-110m.json': 'https://unpkg.com/world-atlas@2/countries-110m.json',
  'states-10m.json': 'https://unpkg.com/us-atlas@3/states-10m.json',
};

// Cache geo data in memory to avoid repeated fetches
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ file: string }> }
) {
  const { file } = await params;
  const sourceUrl = GEO_FILES[file];

  if (!sourceUrl) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }

  // Check memory cache
  const cached = cache.get(file);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json(cached.data, {
      headers: {
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  try {
    const response = await fetch(sourceUrl);
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch geo data' },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Store in cache
    cache.set(file, { data, timestamp: Date.now() });

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error fetching geo data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
