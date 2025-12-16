import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';

// Allowed geo files to prevent directory traversal
const ALLOWED_FILES = new Set(['states-10m.json', 'countries-110m.json']);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ file: string }> }
) {
  const { file } = await params;

  // Security: only allow specific files
  if (!ALLOWED_FILES.has(file)) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }

  try {
    // Try to fetch from Cloudflare ASSETS binding
    const ctx = getCloudflareContext();
    const assets = ctx.env.ASSETS;

    if (assets) {
      const assetUrl = new URL(`/geo/${file}`, 'https://assets.local');
      const response = await assets.fetch(assetUrl.toString());

      if (response.ok) {
        const data = await response.text();
        return new NextResponse(data, {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        });
      }
    }

    // Fallback: return 404 if asset not found
    return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
  } catch (error) {
    console.error('Error fetching geo asset:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Allow caching at edge
export const runtime = 'edge';
