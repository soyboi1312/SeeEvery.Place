'use client';

import { useState, useEffect } from 'react';

interface Banner {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  link_text?: string;
  link_url?: string;
}

export default function SystemBanner() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Load dismissed banner IDs from localStorage
    const stored = localStorage.getItem('dismissedBanners');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setDismissedIds(new Set(parsed));
      } catch {
        // Invalid JSON, ignore
      }
    }

    // Fetch active banners
    fetch('/api/banners')
      .then(res => res.json())
      .then(data => {
        if (data.banners) {
          setBanners(data.banners);
        }
      })
      .catch(err => {
        console.error('Failed to fetch banners:', err);
      });
  }, []);

  const dismissBanner = (id: string) => {
    const newDismissed = new Set(dismissedIds);
    newDismissed.add(id);
    setDismissedIds(newDismissed);
    localStorage.setItem('dismissedBanners', JSON.stringify([...newDismissed]));
  };

  const visibleBanners = banners.filter(b => !dismissedIds.has(b.id));

  if (visibleBanners.length === 0) return null;

  const typeStyles: Record<string, { bg: string; text: string; border: string; icon: string }> = {
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/30',
      text: 'text-blue-800 dark:text-blue-200',
      border: 'border-blue-200 dark:border-blue-700',
      icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-900/30',
      text: 'text-amber-800 dark:text-amber-200',
      border: 'border-amber-200 dark:border-amber-700',
      icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
    },
    success: {
      bg: 'bg-green-50 dark:bg-green-900/30',
      text: 'text-green-800 dark:text-green-200',
      border: 'border-green-200 dark:border-green-700',
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-900/30',
      text: 'text-red-800 dark:text-red-200',
      border: 'border-red-200 dark:border-red-700',
      icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
    },
  };

  return (
    <div className="space-y-1">
      {visibleBanners.map((banner) => {
        const styles = typeStyles[banner.type] || typeStyles.info;
        return (
          <div
            key={banner.id}
            className={`${styles.bg} ${styles.border} ${styles.text} border-b px-4 py-2`}
          >
            <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={styles.icon}
                  />
                </svg>
                <p className="text-sm font-medium truncate">
                  {banner.message}
                  {banner.link_text && banner.link_url && (
                    <a
                      href={banner.link_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 underline hover:no-underline"
                    >
                      {banner.link_text}
                    </a>
                  )}
                </p>
              </div>
              <button
                onClick={() => dismissBanner(banner.id)}
                className="flex-shrink-0 p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                aria-label="Dismiss banner"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
