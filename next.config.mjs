// next.config.mjs
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  // Disable aggressive caching to prevent stale chunk issues in Firefox
  cacheOnFrontEndNav: false,
  aggressiveFrontEndNavCaching: false,
  reloadOnOnline: true,
  swcMinify: true,
  disable: process.env.NODE_ENV === "development", // Disable PWA in dev mode
  workboxOptions: {
    disableDevLogs: true,
    // Force new service worker to activate immediately
    skipWaiting: true,
    clientsClaim: true,
    runtimeCaching: [
      {
        // Match Next.js static chunks (JS files)
        // These files have content hashes in filenames, so they're immutable
        // CacheFirst is correct - new deployments generate new filenames
        urlPattern: /\/_next\/static\/chunks\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "next-chunks",
          expiration: {
            maxEntries: 200,
            maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year (immutable)
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
      {
        // Match Next.js static assets (CSS, images in _next/static)
        urlPattern: /\/_next\/static\/(?!chunks\/).*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "next-static",
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
      {
        // Match static assets in public folder
        urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico|woff|woff2)$/i,
        handler: "CacheFirst",
        options: {
          cacheName: "static-assets",
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
      {
        // Match geo data files - StaleWhileRevalidate for snappy performance
        // These files rarely change, so serve from cache immediately while
        // fetching updates in the background for next time
        urlPattern: /\/geo\/.*/i,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "geo-data",
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
    ],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Optimize package imports for better tree-shaking
  experimental: {
    optimizePackageImports: ['zod', '@supabase/supabase-js', 'react-tooltip', 'lucide-react'],
  },
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // Note: X-XSS-Protection header is deprecated in modern browsers and can
          // create security risks in older browsers. Relying on Content-Security-Policy instead.
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default withPWA(nextConfig);
