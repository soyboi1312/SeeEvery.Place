'use client';

import { useEffect, useRef } from 'react';

const VERSION_STORAGE_KEY = 'app_api_version';
const LAST_CHECK_KEY = 'app_version_last_check';
const CHECK_INTERVAL_MS = 5 * 60 * 1000; // Check every 5 minutes at most

interface VersionResponse {
  apiVersion: number;
  buildId: string;
  deployedAt: string;
}

/**
 * Request persistent storage using the modern navigator.storage API.
 * This replaces the deprecated StorageType.persistent / webkitPersistentStorage API
 * and should be called early to satisfy any third-party code (Cloudflare scripts,
 * service workers) that might otherwise trigger deprecated API warnings.
 */
async function requestPersistentStorage() {
  if (typeof navigator === 'undefined') return;
  if (!navigator.storage?.persist) return;

  try {
    const isPersisted = await navigator.storage.persisted();
    if (!isPersisted) {
      await navigator.storage.persist();
    }
  } catch {
    // Silently ignore - persistent storage is non-critical
  }
}

/**
 * Hook that checks the server API version against the cached version.
 *
 * If the API version has changed (indicating a potentially breaking backend change),
 * it will unregister the service worker and force a page reload to ensure
 * the client gets fresh code that's compatible with the new API.
 *
 * This prevents the scenario where a user with an aggressive service worker cache
 * continues using stale frontend code after a breaking API change.
 */
export function useVersionCheck() {
  const hasChecked = useRef(false);

  useEffect(() => {
    // Only run once per component mount
    if (hasChecked.current) return;
    hasChecked.current = true;

    // Don't run during SSR
    if (typeof window === 'undefined') return;

    // Request persistent storage using modern API to avoid deprecated API warnings
    requestPersistentStorage();

    // Throttle checks to avoid excessive API calls
    const lastCheck = localStorage.getItem(LAST_CHECK_KEY);
    if (lastCheck) {
      const timeSinceLastCheck = Date.now() - parseInt(lastCheck, 10);
      if (timeSinceLastCheck < CHECK_INTERVAL_MS) return;
    }

    checkVersion();
  }, []);
}

async function checkVersion() {
  try {
    // Fetch with cache: 'no-store' to bypass service worker cache
    const response = await fetch('/api/version', {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
      },
    });

    if (!response.ok) {
      console.warn('[VersionCheck] Failed to fetch version:', response.status);
      return;
    }

    const serverVersion: VersionResponse = await response.json();
    localStorage.setItem(LAST_CHECK_KEY, Date.now().toString());

    const storedVersion = localStorage.getItem(VERSION_STORAGE_KEY);

    if (!storedVersion) {
      // First visit - store the version
      localStorage.setItem(VERSION_STORAGE_KEY, serverVersion.apiVersion.toString());
      return;
    }

    const clientApiVersion = parseInt(storedVersion, 10);

    if (serverVersion.apiVersion !== clientApiVersion) {
      console.log(
        `[VersionCheck] API version mismatch. Client: ${clientApiVersion}, Server: ${serverVersion.apiVersion}. Invalidating cache...`
      );

      // Update stored version first
      localStorage.setItem(VERSION_STORAGE_KEY, serverVersion.apiVersion.toString());

      // Unregister service worker and clear caches
      await invalidateServiceWorkerCache();

      // Reload to get fresh code
      window.location.reload();
    }
  } catch (error) {
    // Silently fail - version check is non-critical
    console.warn('[VersionCheck] Error checking version:', error);
  }
}

async function invalidateServiceWorkerCache() {
  if (!('serviceWorker' in navigator)) return;

  try {
    // Get all service worker registrations
    const registrations = await navigator.serviceWorker.getRegistrations();

    // Unregister all service workers
    await Promise.all(
      registrations.map(async (registration) => {
        const success = await registration.unregister();
        if (success) {
          console.log('[VersionCheck] Service worker unregistered');
        }
      })
    );

    // Clear all caches
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(async (cacheName) => {
          await caches.delete(cacheName);
          console.log(`[VersionCheck] Cache deleted: ${cacheName}`);
        })
      );
    }
  } catch (error) {
    console.error('[VersionCheck] Error invalidating cache:', error);
  }
}

/**
 * Manually trigger a version check and cache invalidation.
 * Useful for admin tools or when the user explicitly wants to refresh.
 */
export async function forceVersionRefresh() {
  localStorage.removeItem(VERSION_STORAGE_KEY);
  localStorage.removeItem(LAST_CHECK_KEY);
  await invalidateServiceWorkerCache();
  window.location.reload();
}
