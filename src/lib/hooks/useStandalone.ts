// src/lib/hooks/useStandalone.ts
'use client';

import { useState, useEffect } from 'react';

interface StandaloneState {
  /** Whether the app is running in standalone/installed PWA mode */
  isStandalone: boolean;
  /** Whether running on iOS (Safari-specific behaviors) */
  isIOS: boolean;
  /** Whether running on Android */
  isAndroid: boolean;
  /** Whether the device is mobile (iOS or Android) */
  isMobile: boolean;
  /** Whether the app can be installed (beforeinstallprompt fired) */
  canInstall: boolean;
}

/**
 * Hook to detect if the app is running as an installed PWA (standalone mode)
 * and provide platform-specific information for UI adjustments.
 *
 * Use cases:
 * - Hide "Install App" prompts when already installed
 * - Adjust navigation for standalone mode (no browser chrome)
 * - Show iOS-specific instructions (Add to Home Screen)
 * - Adjust safe area padding for notched devices
 */
export function useStandalone(): StandaloneState {
  const [state, setState] = useState<StandaloneState>({
    isStandalone: false,
    isIOS: false,
    isAndroid: false,
    isMobile: false,
    canInstall: false,
  });

  useEffect(() => {
    // Detect standalone mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true ||
      document.referrer.includes('android-app://');

    // Detect platform
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent) && !(window as Window & { MSStream?: unknown }).MSStream;
    const isAndroid = /android/.test(userAgent);
    const isMobile = isIOS || isAndroid || /mobile/.test(userAgent);

    setState(prev => ({
      ...prev,
      isStandalone,
      isIOS,
      isAndroid,
      isMobile,
    }));

    // Listen for install prompt availability
    const handleInstallPrompt = () => {
      setState(prev => ({ ...prev, canInstall: true }));
    };

    window.addEventListener('beforeinstallprompt', handleInstallPrompt);

    // Listen for display mode changes (e.g., user installs while page is open)
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = (e: MediaQueryListEvent) => {
      setState(prev => ({ ...prev, isStandalone: e.matches }));
    };

    mediaQuery.addEventListener('change', handleDisplayModeChange);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
      mediaQuery.removeEventListener('change', handleDisplayModeChange);
    };
  }, []);

  return state;
}
