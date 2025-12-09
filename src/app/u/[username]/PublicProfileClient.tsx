'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useDarkMode } from '@/lib/hooks/useDarkMode';
import {
  ACHIEVEMENTS,
  calculateTotalXp,
  calculateLevel,
  getTotalVisited,
  getCategoriesStarted,
  getCategoryStats,
  getTierColor,
  AchievementDefinition,
} from '@/lib/achievements';
import {
  UserSelections,
  ALL_CATEGORIES,
  categoryLabels,
  categoryIcons,
  emptySelections,
} from '@/lib/types';
import { StaticWorldMap, StaticUSMap } from '@/components/share';

interface PublicProfile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  is_public: boolean;
  total_xp: number;
  level: number;
  created_at: string;
}

interface UnlockedAchievement {
  id: string;
  achievement_id: string;
  unlocked_at: string;
  category: string | null;
}

interface PublicProfileClientProps {
  profile: PublicProfile;
  selections: Record<string, unknown>;
  achievements: UnlockedAchievement[];
  username: string;
}

// Mini achievement badge for display
function MiniBadge({ achievement }: { achievement: AchievementDefinition }) {
  return (
    <div
      className={`w-12 h-12 rounded-full bg-gradient-to-br ${getTierColor(achievement.tier)} flex items-center justify-center shadow-lg`}
      title={achievement.name}
    >
      <span className="text-xl">{achievement.icon}</span>
    </div>
  );
}

export default function PublicProfileClient({
  profile,
  selections: rawSelections,
  achievements,
  username,
}: PublicProfileClientProps) {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [activeMap, setActiveMap] = useState<'world' | 'usa'>('world');

  // Parse selections safely
  const selections: UserSelections = useMemo(() => {
    if (!rawSelections || typeof rawSelections !== 'object') {
      return emptySelections;
    }

    // Merge with empty selections to ensure all categories exist
    return {
      ...emptySelections,
      ...rawSelections,
    } as UserSelections;
  }, [rawSelections]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalXp = calculateTotalXp(selections);
    return {
      totalXp,
      level: calculateLevel(totalXp),
      totalVisited: getTotalVisited(selections),
      categoriesStarted: getCategoriesStarted(selections),
    };
  }, [selections]);

  // Get category stats
  const categoryStats = useMemo(() => {
    return ALL_CATEGORIES.map((category) => {
      const categoryStats = getCategoryStats(selections, category);
      return {
        category,
        ...categoryStats,
      };
    }).filter((s) => s.visited > 0 || s.bucketList > 0);
  }, [selections]);

  // Get unlocked achievement details
  const unlockedAchievements = useMemo(() => {
    const achievementIds = new Set(achievements.map((a) => a.achievement_id));
    return ACHIEVEMENTS.filter((a) => achievementIds.has(a.id));
  }, [achievements]);

  const displayName = profile.full_name || username;
  const memberSince = new Date(profile.created_at).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-black/5 dark:border-white/10 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-8 h-8 transition-transform group-hover:scale-110 duration-200">
              <Image src="/logo.svg" alt="See Every Place Logo" fill className="object-contain" priority />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-primary-900 dark:text-white leading-none">
                SeeEvery<span className="text-accent-500">.</span>Place<span className="text-[10px] align-super">TM</span>
              </h1>
              <span className="text-[10px] text-primary-500 dark:text-primary-400 font-medium tracking-wider uppercase hidden sm:block">
                Free Travel Tracker
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-primary-50 dark:bg-slate-800 text-primary-600 dark:text-primary-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
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
            <Link
              href="/"
              className="px-4 py-2 bg-primary-700 hover:bg-primary-800 text-white rounded-lg font-medium hover:shadow-lg transition-all text-sm"
            >
              Create Your Map
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-premium border border-black/5 dark:border-white/10 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-4xl md:text-5xl shadow-xl">
              {displayName[0].toUpperCase()}
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold text-primary-900 dark:text-white mb-1">
                {displayName}
              </h1>
              <p className="text-primary-500 dark:text-primary-400 mb-3">
                @{username} | Member since {memberSince}
              </p>
              {profile.bio && (
                <p className="text-primary-600 dark:text-primary-300 mb-4 max-w-lg">
                  {profile.bio}
                </p>
              )}

              {/* Level Badge */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 dark:from-purple-500/20 dark:to-blue-500/20 px-4 py-2 rounded-full">
                <span className="text-2xl">🎖️</span>
                <span className="font-bold text-primary-900 dark:text-white">Level {stats.level}</span>
                <span className="text-primary-500 dark:text-primary-400">|</span>
                <span className="text-primary-600 dark:text-primary-300">{stats.totalXp.toLocaleString()} XP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Map Visualization */}
        {stats.totalVisited > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-premium border border-black/5 dark:border-white/10 mb-6">
            <div className="flex items-center justify-between p-4 border-b border-black/5 dark:border-white/10">
              <h2 className="font-bold text-primary-900 dark:text-white">Travel Map</h2>
              <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                <button
                  onClick={() => setActiveMap('world')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    activeMap === 'world'
                      ? 'bg-white dark:bg-slate-600 text-primary-900 dark:text-white shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  World
                </button>
                <button
                  onClick={() => setActiveMap('usa')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    activeMap === 'usa'
                      ? 'bg-white dark:bg-slate-600 text-primary-900 dark:text-white shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  USA
                </button>
              </div>
            </div>

            <div className="relative w-full aspect-[2/1] bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-4">
              {activeMap === 'world' ? (
                <StaticWorldMap selections={selections} />
              ) : (
                <StaticUSMap selections={selections} />
              )}
            </div>

            {/* Map Legend */}
            <div className="flex justify-center gap-6 py-3 px-4 bg-gray-50 dark:bg-slate-900/50 border-t border-black/5 dark:border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500 shadow-sm"></span>
                <span className="text-xs font-medium text-primary-600 dark:text-primary-300">Visited</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm"></span>
                <span className="text-xs font-medium text-primary-600 dark:text-primary-300">Bucket List</span>
              </div>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-black/5 dark:border-white/10 text-center">
            <div className="text-3xl font-bold text-primary-900 dark:text-white">
              {stats.totalVisited}
            </div>
            <div className="text-sm text-primary-600 dark:text-primary-300">Places Visited</div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-black/5 dark:border-white/10 text-center">
            <div className="text-3xl font-bold text-primary-900 dark:text-white">
              {stats.categoriesStarted}
            </div>
            <div className="text-sm text-primary-600 dark:text-primary-300">Categories</div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-black/5 dark:border-white/10 text-center">
            <div className="text-3xl font-bold text-primary-900 dark:text-white">
              {unlockedAchievements.length}
            </div>
            <div className="text-sm text-primary-600 dark:text-primary-300">Achievements</div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-black/5 dark:border-white/10 text-center">
            <div className="text-3xl font-bold text-primary-900 dark:text-white">
              {stats.level}
            </div>
            <div className="text-sm text-primary-600 dark:text-primary-300">Level</div>
          </div>
        </div>

        {/* Achievements Showcase */}
        {unlockedAchievements.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-black/5 dark:border-white/10 mb-6">
            <h2 className="text-lg font-bold text-primary-900 dark:text-white mb-4">
              Achievements ({unlockedAchievements.length})
            </h2>
            <div className="flex flex-wrap gap-3">
              {unlockedAchievements.slice(0, 12).map((achievement) => (
                <MiniBadge key={achievement.id} achievement={achievement} />
              ))}
              {unlockedAchievements.length > 12 && (
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-bold text-gray-600 dark:text-gray-400">
                  +{unlockedAchievements.length - 12}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Category Progress */}
        {categoryStats.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-black/5 dark:border-white/10 mb-6">
            <h2 className="text-lg font-bold text-primary-900 dark:text-white mb-4">
              Travel Progress
            </h2>
            <div className="grid gap-4">
              {categoryStats.map(({ category, visited, bucketList, total, percentage }) => (
                <div key={category} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-slate-700 flex items-center justify-center text-xl">
                    {categoryIcons[category]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-primary-900 dark:text-white truncate">
                        {categoryLabels[category]}
                      </span>
                      <span className="text-sm text-primary-600 dark:text-primary-300 ml-2">
                        {visited} / {total}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    {bucketList > 0 && (
                      <span className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                        +{bucketList} on bucket list
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-primary-900 dark:text-white">
                      {percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white text-center">
          <h2 className="text-xl font-bold mb-2">Create Your Own Travel Map</h2>
          <p className="text-white/80 mb-4">
            Track your adventures, earn achievements, and share your journey with the world.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg font-bold hover:bg-gray-100 transition-colors"
          >
            Get Started Free
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-black/5 dark:border-white/10 bg-white/50 dark:bg-slate-900/50">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-primary-500 dark:text-primary-400">
          <div className="flex justify-center gap-4 mb-2">
            <Link href="/about" className="hover:text-primary-700 dark:hover:text-primary-200 transition-colors">About</Link>
            <span>|</span>
            <Link href="/achievements" className="hover:text-primary-700 dark:hover:text-primary-200 transition-colors">Achievements</Link>
            <span>|</span>
            <Link href="/privacy" className="hover:text-primary-700 dark:hover:text-primary-200 transition-colors">Privacy</Link>
            <span>|</span>
            <Link href="/terms" className="hover:text-primary-700 dark:hover:text-primary-200 transition-colors">Terms</Link>
          </div>
          <p>See Every Place - Free Travel Tracker</p>
        </div>
      </footer>
    </div>
  );
}
