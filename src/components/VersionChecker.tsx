'use client';

import { useVersionCheck } from '@/lib/hooks/useVersionCheck';

/**
 * Client component that performs API version checking.
 *
 * When the server API version differs from the client's cached version,
 * this component will unregister the service worker, clear caches,
 * and force a page reload to ensure compatibility.
 *
 * This renders nothing - it's purely for side effects.
 */
export default function VersionChecker() {
  useVersionCheck();
  return null;
}
