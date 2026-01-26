// next.config.mjs
import withPWAInit from "@ducanh2912/next-pwa";
import withBundleAnalyzer from '@next/bundle-analyzer';

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const withPWA = withPWAInit({
  dest: "public",
  // Disable aggressive caching to prevent stale chunk issues in Firefox
  cacheOnFrontEndNav: false,
  aggressiveFrontEndNavCaching: false,
  // Don't force reload when connection returns - user may have unsaved form data
  // or be mid-interaction. The app can handle reconnection gracefully via UI.
  reloadOnOnline: false,
  swcMinify: true,
  disable: process.env.NODE_ENV === "development", // Disable PWA in dev mode
  fallbacks: {
    document: "/offline", // Offline fallback page for navigation requests
  },
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
        // Match geo data files - CacheFirst for instant loading
        // These files are already marked as immutable with long Cache-Control headers,
        // so CacheFirst trusts the cache and avoids unnecessary network requests.
        // StaleWhileRevalidate would still ping the network in the background, wasting
        // Cloudflare requests when the files never actually change.
        //
        // VERSIONING NOTE: If you update a geo file (e.g., fix a border), returning users
        // won't see the update until their cache expires (30 days). To force an update:
        //   Option A: Rename the file (e.g., countries-v2.json) and update imports
        //   Option B: Use a version query param in the URL (e.g., ?v=2)
        // The 30-day expiration balances freshness vs CDN cost optimization.
        urlPattern: /\/geo\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "geo-data",
          expiration: {
            // Increased from 10 to cover full user exploration paths
            // (World -> USA -> State -> Category maps without cache eviction)
            maxEntries: 50,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
      {
        // Cache clustering worker file - it rarely changes
        urlPattern: /\/clustering-worker\.js$/i,
        handler: "CacheFirst",
        options: {
          cacheName: "workers",
          expiration: {
            maxEntries: 5,
            maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
      {
        // Cache static JSON data files
        urlPattern: /\/data\/.*\.json$/i,
        handler: "CacheFirst",
        options: {
          cacheName: "static-data",
          expiration: {
            maxEntries: 30,
            maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year (data rarely changes)
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
  // Remove console.log in production builds (keeps warnings/errors for debugging)
  // Reduces bundle size and cleans up client-side execution
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? {
      exclude: ["error", "warn"],
    } : false,
  },
  // Use Cloudflare Image Resizing instead of Next.js default optimizer
  // This offloads image processing to Cloudflare's edge, avoiding Node.js limits on Workers
  images: {
    loader: 'custom',
    loaderFile: './src/lib/cloudflare-loader.ts',
    // Allow images from Supabase storage
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  // Optimize package imports for better tree-shaking
  experimental: {
    // React Compiler for automatic memoization optimization
    // Reduces manual memo/useCallback overhead and handles deep dependency comparisons
    reactCompiler: true,
    // Inline critical CSS and defer non-critical to reduce render-blocking
    optimizeCss: true,
    optimizePackageImports: [
      'zod',
      '@supabase/supabase-js',
      'react-tooltip',
      'lucide-react',
      '@radix-ui/react-alert-dialog',
      '@radix-ui/react-context-menu',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-select',
      '@radix-ui/react-tabs',
      '@radix-ui/react-tooltip',
      '@tanstack/react-query',
      'class-variance-authority',
      'clsx',
      'tailwind-merge',
    ],
  },
  async headers() {
    return [
      {
        // GeoJSON and static geo data files - immutable with long-term caching
        // These files rarely change and are critical for map rendering performance
        source: '/geo/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
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
          {
            // HSTS: Force HTTPS for 2 years, include subdomains, allow preload list inclusion
            // Prevents downgrade attacks and saves RTT of HTTP->HTTPS redirect
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            // Content Security Policy - allows Next.js inline scripts and workers
            // - 'unsafe-inline': Required for Next.js inline scripts and Tailwind/CSS-in-JS styles
            // - 'unsafe-eval': Required for React Compiler (experimental) and some Next.js internals
            //   Note: Cannot easily remove in production while using reactCompiler: true
            // - blob:/worker-src: Required for Web Workers (clustering worker, service worker)
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://static.cloudflareinsights.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://*.supabase.co",
              "font-src 'self' data:",
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://cloudflareinsights.com https://unpkg.com",
              "worker-src 'self' blob:",
              "frame-ancestors 'none'",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

// Wrap with both PWA and Bundle Analyzer
export default bundleAnalyzer(withPWA(nextConfig));
