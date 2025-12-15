/**
 * Cloudflare Image Resizing Loader
 * Docs: https://developers.cloudflare.com/images/image-resizing/
 *
 * This loader generates URLs that trigger Cloudflare's edge-based image optimization.
 * Benefits:
 * - Automatic format selection (WebP/AVIF based on browser support)
 * - Edge caching of resized images
 * - No Node.js image processing on Workers
 */
export default function cloudflareLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  const params = [
    `width=${width}`,
    `quality=${quality || 75}`,
    // Cloudflare automatically picks the best format (WebP/AVIF) based on the user's browser
    'format=auto',
  ];

  const paramsString = params.join(',');

  // Handle both absolute URLs and relative paths
  // Cloudflare resolves relative paths against your domain automatically
  return `/cdn-cgi/image/${paramsString}/${src}`;
}
