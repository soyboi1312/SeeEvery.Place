'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Category, categoryLabels, categoryIcons, CategoryGroup, getGroupForCategory } from '@/lib/types';

// Group categories by their CategoryGroup for the dropdown
const categoryGroups: Record<CategoryGroup, Category[]> = {
  geography: ['countries', 'states', 'territories', 'usCities', 'worldCities'],
  nature: ['nationalParks', 'nationalMonuments', 'stateParks', 'fiveKPeaks', 'fourteeners'],
  culture: ['museums', 'weirdAmericana'],
  sports: ['mlbStadiums', 'nflStadiums', 'nbaStadiums', 'nhlStadiums', 'soccerStadiums', 'f1Tracks', 'marathons'],
  adventure: ['airports', 'skiResorts', 'themeParks', 'surfingReserves'],
};

const groupLabels: Record<CategoryGroup, string> = {
  geography: 'Geography',
  nature: 'Nature & Parks',
  culture: 'Culture',
  sports: 'Sports',
  adventure: 'Adventure',
};

type SyncStatus = 'idle' | 'syncing' | 'offline';

interface HeaderProps {
  onSignIn: () => void;
  onSignOut: () => void;
  isSignedIn: boolean;
  userEmail?: string;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  isAdmin?: boolean;
  syncStatus?: SyncStatus;
}

// Sync status icon component
function SyncStatusIcon({ status }: { status: SyncStatus }) {
  if (status === 'syncing') {
    return (
      <div className="p-2 rounded-lg" title="Syncing to cloud...">
        <svg className="w-5 h-5 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </div>
    );
  }

  if (status === 'offline') {
    return (
      <div className="p-2 rounded-lg" title="Offline - changes saved locally">
        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4l16 16" />
        </svg>
      </div>
    );
  }

  // idle/synced state - show a checkmark cloud
  return (
    <div className="p-2 rounded-lg" title="Synced to cloud">
      <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
      </svg>
    </div>
  );
}

export default function Header({ onSignIn, onSignOut, isSignedIn, userEmail, isDarkMode, onToggleDarkMode, isAdmin, syncStatus }: HeaderProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showExplore, setShowExplore] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const exploreRef = useRef<HTMLDivElement>(null);

  // Track scroll position for dynamic header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
      if (exploreRef.current && !exploreRef.current.contains(event.target as Node)) {
        setShowExplore(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const userInitial = userEmail ? userEmail[0].toUpperCase() : 'U';

  return (
    <header className={`bg-white/90 dark:bg-slate-900/90 backdrop-blur-md sticky top-0 z-40 transition-all duration-200 ${
      isScrolled
        ? 'border-b border-gray-200/60 dark:border-slate-700/60 shadow-sm'
        : 'border-b border-transparent'
    }`}>
      <div className="max-w-6xl mx-auto px-4 py-2 sm:py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            {/* Logo with hover effect */}
            <div className="relative w-8 h-8 transition-transform group-hover:scale-110 duration-200">
              <Image
                src="/logo.svg"
                alt="See Every Place Logo"
                fill
                className="object-contain"
                priority
              />
            </div>

            <div className="flex flex-col">
              <span className="text-xl font-bold text-primary-900 dark:text-white leading-none">
                SeeEvery<span className="text-accent-500">.</span>Place<span className="text-[10px] align-super text-primary-400">™</span>
              </span>
              <span className="text-[10px] text-primary-500 dark:text-primary-400 font-medium tracking-wider uppercase hidden sm:block">
                Free Travel Tracker
              </span>
            </div>
          </Link>

          {/* Explore Dropdown - hidden on mobile, visible on sm+ */}
          <div className="relative hidden sm:block" ref={exploreRef}>
            <button
              onClick={() => setShowExplore(!showExplore)}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-primary-700 dark:text-primary-200 hover:bg-primary-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
              aria-expanded={showExplore}
              aria-haspopup="menu"
            >
              <span>Explore</span>
              <svg className={`w-4 h-4 transition-transform ${showExplore ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showExplore && (
              <div className="absolute left-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-premium-lg border border-black/5 dark:border-white/10 py-2 z-50 max-h-[70vh] overflow-y-auto">
                {(Object.keys(categoryGroups) as CategoryGroup[]).map((group) => (
                  <div key={group} className="px-2 py-1">
                    <div className="px-3 py-1.5 text-xs font-semibold text-primary-500 dark:text-primary-400 uppercase tracking-wider">
                      {groupLabels[group]}
                    </div>
                    <div className="space-y-0.5">
                      {categoryGroups[group].map((cat) => (
                        <Link
                          key={cat}
                          href={`/?category=${cat}`}
                          onClick={() => setShowExplore(false)}
                          className="flex items-center gap-3 px-3 py-2 text-sm text-primary-700 dark:text-primary-200 hover:bg-primary-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        >
                          <span className="text-lg">{categoryIcons[cat]}</span>
                          <span>{categoryLabels[cat]}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sync Status Icon - only show when signed in */}
          {isSignedIn && syncStatus && (
            <SyncStatusIcon status={syncStatus} />
          )}

          {/* Dark Mode Toggle */}
          {onToggleDarkMode && (
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-lg bg-primary-50 dark:bg-slate-800 text-primary-600 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-slate-700 transition-colors"
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          )}
          {!isSignedIn ? (
            <button
              onClick={onSignIn}
              className="flex items-center gap-2 px-4 py-2 bg-primary-50 dark:bg-slate-800 text-primary-700 dark:text-primary-200 border border-primary-200 dark:border-slate-600 rounded-lg font-medium hover:bg-primary-100 dark:hover:bg-slate-700 transition-all text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Sign In</span>
            </button>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center text-white font-bold text-sm hover:shadow-md transition-all"
                title={userEmail}
                aria-label="Open user menu"
                aria-expanded={showDropdown}
                aria-haspopup="menu"
              >
                {userInitial}
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-premium-lg border border-black/5 dark:border-white/10 py-1 z-50">
                  <div className="px-4 py-2 border-b border-black/5 dark:border-white/10">
                    <p className="text-sm font-medium text-primary-900 dark:text-white truncate">{userEmail}</p>
                    <p className="text-xs text-primary-500 dark:text-primary-400">Signed in</p>
                  </div>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setShowDropdown(false)}
                      className="w-full text-left px-4 py-2 text-sm text-primary-700 dark:text-primary-200 hover:bg-primary-50 dark:hover:bg-slate-700 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Admin
                    </Link>
                  )}
                  <Link
                    href="/settings"
                    onClick={() => setShowDropdown(false)}
                    className="w-full text-left px-4 py-2 text-sm text-primary-700 dark:text-primary-200 hover:bg-primary-50 dark:hover:bg-slate-700 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    My Profile
                  </Link>
                  <button
                    onClick={() => {
                      onSignOut();
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-primary-700 dark:text-primary-200 hover:bg-primary-50 dark:hover:bg-slate-700 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
