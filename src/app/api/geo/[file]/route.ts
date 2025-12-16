import { NextRequest, NextResponse } from 'next/server';

// Import JSON files directly - they'll be bundled into the worker
import statesData from '../../../../../public/geo/states-10m.json';
import countriesData from '../../../../../public/geo/countries-110m.json';

// Map file names to imported data
const GEO_FILES: Record<string, unknown> = {
  'states-10m.json': statesData,
  'countries-110m.json': countriesData,
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ file: string }> }
) {
  const { file } = await params;

  const data = GEO_FILES[file];

  if (!data) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }

  return new NextResponse(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}

// Dynamic route
export const dynamic = 'force-dynamic';
