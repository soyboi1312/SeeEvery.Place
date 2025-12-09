'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useDarkMode } from '@/lib/hooks/useDarkMode';
import { createClient } from '@/lib/supabase/client';
import { loadSelections } from '@/lib/storage';
import {
  ACHIEVEMENTS,
  AchievementDefinition,
  AchievementTier,
  calculateTotalXp,
  calculateLevel,
  xpToNextLevel,
  isAchievementUnlocked,
  getAchievementProgress,
  getTierColor,
  getTierLabel,
  getTotalVisited,
  getCategoriesStarted,
} from '@/lib/achievements';
import { categoryLabels, categoryIcons, Category } from '@/lib/types';
import type { User } from '@supabase/supabase-js';
import type { UserSelections } from '@/lib/types';

// Achievement Badge SVG Component
function AchievementBadge({
  achievement,
  isUnlocked,
  progress,
  size = 'default',
}: {
  achievement: AchievementDefinition;
  isUnlocked: boolean;
  progress: { current: number; target: number; percentage: number };
  size?: 'small' | 'default' | 'large';
}) {
  const sizeClasses = {
    small: 'w-16 h-16',
    default: 'w-24 h-24',
    large: 'w-32 h-32',
  };

  const iconSizes = {
    small: 'text-2xl',
    default: 'text-4xl',
    large: 'text-5xl',
  };

  return (
    <div className={`relative ${sizeClasses[size]}`}>
      {/* Badge Background */}
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Outer ring - shows progress */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={isUnlocked ? 'transparent' : '#e5e7eb'}
          strokeWidth="6"
          className="dark:stroke-gray-700"
        />
        {!isUnlocked && (
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="url(#progressGradient)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${progress.percentage * 2.83} 283`}
            transform="rotate(-90 50 50)"
          />
        )}

        {/* Badge body */}
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          <linearGradient id={`tierGradient-${achievement.tier}`} x1="0%" y1="0%" x2="100%" y2="100%">
            {achievement.tier === 'bronze' && (
              <>
                <stop offset="0%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#92400e" />
              </>
            )}
            {achievement.tier === 'silver' && (
              <>
                <stop offset="0%" stopColor="#9ca3af" />
                <stop offset="100%" stopColor="#6b7280" />
              </>
            )}
            {achievement.tier === 'gold' && (
              <>
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#d97706" />
              </>
            )}
            {achievement.tier === 'platinum' && (
              <>
                <stop offset="0%" stopColor="#67e8f9" />
                <stop offset="100%" stopColor="#06b6d4" />
              </>
            )}
            {achievement.tier === 'legendary' && (
              <>
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#ec4899" />
              </>
            )}
          </linearGradient>
        </defs>

        {/* Inner circle */}
        <circle
          cx="50"
          cy="50"
          r="38"
          fill={isUnlocked ? `url(#tierGradient-${achievement.tier})` : '#f3f4f6'}
          className={!isUnlocked ? 'dark:fill-gray-800' : ''}
        />

        {/* Shine effect for unlocked badges */}
        {isUnlocked && (
          <ellipse
            cx="40"
            cy="35"
            rx="15"
            ry="10"
            fill="white"
            opacity="0.3"
          />
        )}
      </svg>

      {/* Icon overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className={`${iconSizes[size]} ${
            isUnlocked ? '' : 'grayscale opacity-50'
          }`}
        >
          {achievement.icon}
        </span>
      </div>

      {/* Lock overlay for locked achievements */}
      {!isUnlocked && (
        <div className="absolute bottom-0 right-0 w-6 h-6 bg-gray-500 dark:bg-gray-600 rounded-full flex items-center justify-center shadow-md">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
    </div>
  );
}

// Achievement Card Component
function AchievementCard({
  achievement,
  isUnlocked,
  progress,
  unlockedAt,
}: {
  achievement: AchievementDefinition;
  isUnlocked: boolean;
  progress: { current: number; target: number; percentage: number };
  unlockedAt?: string;
}) {
  const tierColors: Record<AchievementTier, string> = {
    bronze: 'border-amber-500/50 bg-amber-500/5',
    silver: 'border-gray-400/50 bg-gray-400/5',
    gold: 'border-yellow-500/50 bg-yellow-500/5',
    platinum: 'border-cyan-500/50 bg-cyan-500/5',
    legendary: 'border-purple-500/50 bg-purple-500/5',
  };

  return (
    <div
      className={`rounded-xl border-2 p-4 transition-all ${
        isUnlocked
          ? tierColors[achievement.tier]
          : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'
      }`}
    >
      <div className="flex items-start gap-4">
        <AchievementBadge
          achievement={achievement}
          isUnlocked={isUnlocked}
          progress={progress}
          size="default"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3
              className={`font-bold ${
                isUnlocked
                  ? 'text-primary-900 dark:text-white'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {achievement.name}
            </h3>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                isUnlocked
                  ? `bg-gradient-to-r ${getTierColor(achievement.tier)} text-white`
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              {getTierLabel(achievement.tier)}
            </span>
          </div>

          <p
            className={`text-sm mb-2 ${
              isUnlocked
                ? 'text-primary-600 dark:text-primary-300'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            {achievement.description}
          </p>

          {/* Progress bar for locked achievements */}
          {!isUnlocked && (
            <div className="mb-2">
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                <span>Progress</span>
                <span>
                  {progress.current} / {progress.target}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-xs text-primary-500 dark:text-primary-400">
              +{achievement.xpReward} XP
            </span>
            {isUnlocked && unlockedAt && (
              <span className="text-xs text-green-600 dark:text-green-400">
                Unlocked {new Date(unlockedAt).toLocaleDateString()}
              </span>
            )}
            {achievement.category !== 'global' && (
              <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                {categoryIcons[achievement.category as Category]}
                {categoryLabels[achievement.category as Category]}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AchievementsPage() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [user, setUser] = useState<User | null>(null);
  const [selections, setSelections] = useState<UserSelections | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      const sel = loadSelections();
      setSelections(sel);
      setIsLoading(false);
    });
  }, []);

  // Calculate stats
  const stats = useMemo(() => {
    if (!selections) {
      return {
        totalXp: 0,
        level: 1,
        levelProgress: { current: 0, needed: 100, progress: 0 },
        totalVisited: 0,
        categoriesStarted: 0,
      };
    }

    const totalXp = calculateTotalXp(selections);
    return {
      totalXp,
      level: calculateLevel(totalXp),
      levelProgress: xpToNextLevel(totalXp),
      totalVisited: getTotalVisited(selections),
      categoriesStarted: getCategoriesStarted(selections),
    };
  }, [selections]);

  // Process achievements
  const processedAchievements = useMemo(() => {
    if (!selections) return [];

    return ACHIEVEMENTS.map((achievement) => {
      const isUnlocked = isAchievementUnlocked(achievement, selections, stats.level);
      const progress = getAchievementProgress(achievement, selections, stats.level);

      return {
        achievement,
        isUnlocked,
        progress,
        // In a real app, this would come from the database
        unlockedAt: isUnlocked ? new Date().toISOString() : undefined,
      };
    });
  }, [selections, stats.level]);

  // Filter achievements
  const filteredAchievements = useMemo(() => {
    return processedAchievements.filter((item) => {
      // Status filter
      if (filter === 'unlocked' && !item.isUnlocked) return false;
      if (filter === 'locked' && item.isUnlocked) return false;

      // Category filter
      if (categoryFilter !== 'all' && item.achievement.category !== categoryFilter) {
        return false;
      }

      return true;
    });
  }, [processedAchievements, filter, categoryFilter]);

  // Get unique categories from achievements
  const achievementCategories = useMemo(() => {
    const categories = new Set<string>();
    ACHIEVEMENTS.forEach((a) => categories.add(a.category));
    return Array.from(categories);
  }, []);

  // Stats summary
  const achievementStats = useMemo(() => {
    const unlocked = processedAchievements.filter((a) => a.isUnlocked).length;
    const total = processedAchievements.length;
    const totalXpEarned = processedAchievements
      .filter((a) => a.isUnlocked)
      .reduce((sum, a) => sum + a.achievement.xpReward, 0);

    return { unlocked, total, totalXpEarned };
  }, [processedAchievements]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
              Back to Map
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-primary-900 dark:text-white mb-1">Achievements</h2>
            <p className="text-primary-600 dark:text-primary-300">
              Track your travel milestones and earn badges
            </p>
          </div>
          {user && (
            <Link
              href="/settings"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              View Profile
            </Link>
          )}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-black/5 dark:border-white/10">
            <div className="text-3xl font-bold text-primary-900 dark:text-white">
              {stats.level}
            </div>
            <div className="text-sm text-primary-600 dark:text-primary-300">Level</div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-black/5 dark:border-white/10">
            <div className="text-3xl font-bold text-primary-900 dark:text-white">
              {stats.totalXp.toLocaleString()}
            </div>
            <div className="text-sm text-primary-600 dark:text-primary-300">Total XP</div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-black/5 dark:border-white/10">
            <div className="text-3xl font-bold text-primary-900 dark:text-white">
              {achievementStats.unlocked}/{achievementStats.total}
            </div>
            <div className="text-sm text-primary-600 dark:text-primary-300">Achievements</div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-black/5 dark:border-white/10">
            <div className="text-3xl font-bold text-primary-900 dark:text-white">
              {stats.totalVisited}
            </div>
            <div className="text-sm text-primary-600 dark:text-primary-300">Places Visited</div>
          </div>
        </div>

        {/* Level Progress */}
        <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 dark:from-purple-500/20 dark:to-blue-500/20 rounded-xl p-6 mb-8 border border-purple-500/20 dark:border-purple-500/30">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-4xl">🎖️</span>
              <div>
                <div className="font-bold text-xl text-primary-900 dark:text-white">
                  Level {stats.level}
                </div>
                <div className="text-sm text-primary-600 dark:text-primary-300">
                  {stats.levelProgress.current.toLocaleString()} / {stats.levelProgress.needed.toLocaleString()} XP to next level
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary-900 dark:text-white">
                Level {stats.level + 1}
              </div>
              <div className="text-sm text-primary-500 dark:text-primary-400">Next Level</div>
            </div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-4 rounded-full transition-all duration-500"
              style={{ width: `${stats.levelProgress.progress}%` }}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                filter === 'all'
                  ? 'bg-white dark:bg-gray-700 text-primary-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              All ({processedAchievements.length})
            </button>
            <button
              onClick={() => setFilter('unlocked')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                filter === 'unlocked'
                  ? 'bg-white dark:bg-gray-700 text-primary-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Unlocked ({achievementStats.unlocked})
            </button>
            <button
              onClick={() => setFilter('locked')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                filter === 'locked'
                  ? 'bg-white dark:bg-gray-700 text-primary-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Locked ({achievementStats.total - achievementStats.unlocked})
            </button>
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 text-sm font-medium rounded-lg bg-gray-100 dark:bg-gray-800 text-primary-900 dark:text-white border-0"
          >
            <option value="all">All Categories</option>
            <option value="global">Global</option>
            {achievementCategories
              .filter((c) => c !== 'global')
              .map((category) => (
                <option key={category} value={category}>
                  {categoryLabels[category as Category] || category}
                </option>
              ))}
          </select>
        </div>

        {/* Achievements Grid */}
        {filteredAchievements.length > 0 ? (
          <div className="space-y-4">
            {filteredAchievements.map((item) => (
              <AchievementCard
                key={item.achievement.id}
                achievement={item.achievement}
                isUnlocked={item.isUnlocked}
                progress={item.progress}
                unlockedAt={item.unlockedAt}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-black/5 dark:border-white/10">
            <span className="text-4xl mb-3 block">🔍</span>
            <p className="text-primary-600 dark:text-primary-300">
              No achievements found with current filters
            </p>
          </div>
        )}

        {/* Not signed in notice */}
        {!user && (
          <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 text-center">
            <h3 className="font-bold text-primary-900 dark:text-white mb-2">
              Sign in to save your progress
            </h3>
            <p className="text-primary-600 dark:text-primary-300 mb-4">
              Your achievements are currently stored locally. Sign in to sync across devices and share your profile.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Go to Home
            </Link>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-black/5 dark:border-white/10 bg-white/50 dark:bg-slate-900/50">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-primary-500 dark:text-primary-400">
          <div className="flex justify-center gap-4 mb-2">
            <Link href="/about" className="hover:text-primary-700 dark:hover:text-primary-200 transition-colors">About</Link>
            <span>|</span>
            <Link href="/settings" className="hover:text-primary-700 dark:hover:text-primary-200 transition-colors">Settings</Link>
            <span>|</span>
            <Link href="/suggest" className="hover:text-primary-700 dark:hover:text-primary-200 transition-colors">Suggest</Link>
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
