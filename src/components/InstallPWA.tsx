// src/components/InstallPWA.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { X, Download, Smartphone } from 'lucide-react';
import { useStandalone } from '@/lib/hooks/useStandalone';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISS_KEY = 'pwa-install-dismissed';
const DISMISS_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export default function InstallPWA() {
  const { isStandalone, isIOS } = useStandalone();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Don't show install prompt if already installed
    if (isStandalone) return;

    // Check if user dismissed recently
    const dismissedAt = localStorage.getItem(DISMISS_KEY);
    if (dismissedAt && Date.now() - parseInt(dismissedAt) < DISMISS_DURATION) {
      return;
    }

    // For iOS, show manual instructions after a delay
    if (isIOS) {
      const timer = setTimeout(() => setShowBanner(true), 3000);
      return () => clearTimeout(timer);
    }

    // For Android/Desktop Chrome, capture the install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show banner after short delay to not interrupt initial experience
      setTimeout(() => setShowBanner(true), 2000);
    };

    // Listen for successful installation to hide banner immediately
    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setShowBanner(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isStandalone, isIOS]);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setShowBanner(false);
      setDeferredPrompt(null);
    }
  }, [deferredPrompt]);

  const handleDismiss = useCallback(() => {
    setShowBanner(false);
    localStorage.setItem(DISMISS_KEY, Date.now().toString());
  }, []);

  // Don't render if already installed or banner not ready
  if (isStandalone || !showBanner) {
    return null;
  }

  // iOS-specific instructions (no native install prompt)
  if (isIOS) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 shadow-lg animate-slide-down">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Smartphone className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium truncate">
              Install app: tap{' '}
              <span className="inline-flex items-center">
                <svg className="w-4 h-4 mx-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L12 14M12 14L7 9M12 14L17 9M4 16V20H20V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
              </span>
              then &quot;Add to Home Screen&quot;
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1 hover:bg-white/20 rounded-full transition-colors flex-shrink-0"
            aria-label="Dismiss install prompt"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // Android/Desktop Chrome prompt
  if (deferredPrompt) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 shadow-lg animate-slide-down">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Download className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium truncate">
              Install See Every Place for offline access
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleInstall}
              className="px-3 py-1.5 bg-white text-blue-600 rounded-full text-sm font-semibold hover:bg-blue-50 transition-colors"
            >
              Install
            </button>
            <button
              onClick={handleDismiss}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Dismiss install prompt"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
