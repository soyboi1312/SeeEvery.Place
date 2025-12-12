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
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sun, Moon, Trophy, Medal, Sparkles, Lock, LogIn, Loader2 } from 'lucide-react';

// Type for processed achievement items
interface ProcessedAchievement {
  achievement: AchievementDefinition;
  isUnlocked: boolean;
  progress: { current: number; target: number; percentage: number };
  unlockedAt?: string;
}

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
          <Lock className="w-3 h-3 text-white" />
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
  isGuest,
}: {
  achievement: AchievementDefinition;
  isUnlocked: boolean;
  progress: { current: number; target: number; percentage: number };
  unlockedAt?: string;
  isGuest?: boolean;
}) {
  const tierColors: Record<AchievementTier, string> = {
    bronze: 'border-amber-500/50 bg-amber-500/5',
    silver: 'border-gray-400/50 bg-gray-400/5',
    gold: 'border-yellow-500/50 bg-yellow-500/5',
    platinum: 'border-cyan-500/50 bg-cyan-500/5',
    legendary: 'border-purple-500/50 bg-purple-500/5',
  };

  return (
    <Card
      className={`transition-all relative ${
        isUnlocked
          ? tierColors[achievement.tier]
          : 'border-muted bg-muted/30'
      } ${isUnlocked && isGuest ? 'border-dashed' : ''}`}
    >
      {/* Guest indicator for unlocked achievements */}
      {isUnlocked && isGuest && (
        <Badge variant="secondary" className="absolute top-2 right-2 text-[10px] bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
          Local Only
        </Badge>
      )}
      <CardContent className="p-4">
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
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                }`}
              >
                {achievement.name}
              </h3>
              <Badge
                className={
                  isUnlocked
                    ? `bg-gradient-to-r ${getTierColor(achievement.tier)} text-white`
                    : ''
                }
                variant={isUnlocked ? 'default' : 'secondary'}
              >
                {getTierLabel(achievement.tier)}
              </Badge>
            </div>

            <p
              className={`text-sm mb-2 ${
                isUnlocked
                  ? 'text-muted-foreground'
                  : 'text-muted-foreground/70'
              }`}
            >
              {achievement.description}
            </p>

            {/* Progress bar for locked achievements */}
            {!isUnlocked && (
              <div className="mb-2">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Progress</span>
                  <span>
                    {progress.current} / {progress.target}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progress.percentage}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-xs text-primary">
                +{achievement.xpReward} XP
              </span>
              {isUnlocked && unlockedAt && (
                <span className="text-xs text-green-600 dark:text-green-400">
                  Unlocked {new Date(unlockedAt).toLocaleDateString()}
                </span>
              )}
              {achievement.category !== 'global' && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  {categoryIcons[achievement.category as Category]}
                  {categoryLabels[achievement.category as Category]}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AchievementsPage() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [user, setUser] = useState<User | null>(null);
  const [selections, setSelections] = useState<UserSelections | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [newUnlocks, setNewUnlocks] = useState<ProcessedAchievement[]>([]);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      setUser(user);
      const sel = await loadSelections();
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
        unlockedAt: isUnlocked ? new Date().toISOString() : undefined,
      };
    });
  }, [selections, stats.level]);

  // Effect to identify and manage new unlocks for highlighting
  useEffect(() => {
    if (processedAchievements.length === 0) return;

    const KNOWN_KEY = 'seeeveryplace_known_achievements';
    const stored = localStorage.getItem(KNOWN_KEY);
    const knownIds: string[] = stored ? JSON.parse(stored) : [];

    const brandNew = processedAchievements.filter(item =>
      item.isUnlocked && !knownIds.includes(item.achievement.id)
    );

    if (brandNew.length > 0) {
      setNewUnlocks(brandNew);

      const allUnlockedIds = processedAchievements
        .filter(a => a.isUnlocked)
        .map(a => a.achievement.id);

      localStorage.setItem(KNOWN_KEY, JSON.stringify(allUnlockedIds));
    }
  }, [processedAchievements]);

  // Filter achievements
  const filteredAchievements = useMemo(() => {
    return processedAchievements.filter((item) => {
      if (filter === 'unlocked' && !item.isUnlocked) return false;
      if (filter === 'locked' && item.isUnlocked) return false;

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
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-border sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-8 h-8 transition-transform group-hover:scale-110 duration-200">
              <Image src="/logo.svg" alt="See Every Place Logo" fill className="object-contain" priority />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-foreground leading-none">
                SeeEvery<span className="text-blue-500">.</span>Place<span className="text-[10px] align-super">™</span>
              </h1>
              <span className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase hidden sm:block">
                Free Travel Tracker
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Button asChild>
              <Link href="/">Back to Map</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-1">Achievements</h2>
            <p className="text-muted-foreground">
              Track your travel milestones and earn badges
            </p>
          </div>
          {user && (
            <Link
              href="/settings"
              className="text-sm text-primary hover:underline"
            >
              View Profile
            </Link>
          )}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-4">
              <div className="text-3xl font-bold text-foreground">
                {stats.level}
              </div>
              <div className="text-sm text-muted-foreground">Level</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-3xl font-bold text-foreground">
                {stats.totalXp.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total XP</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-3xl font-bold text-foreground">
                {achievementStats.unlocked}/{achievementStats.total}
              </div>
              <div className="text-sm text-muted-foreground">Achievements</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-3xl font-bold text-foreground">
                {stats.totalVisited}
              </div>
              <div className="text-sm text-muted-foreground">Places Visited</div>
            </CardContent>
          </Card>
        </div>

        {/* New Achievements Alert */}
        {newUnlocks.length > 0 && (
          <Card className="mb-8 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30">
            <CardContent className="pt-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">
                <Trophy className="w-16 h-16" />
              </div>
              <h3 className="text-xl font-bold text-yellow-700 dark:text-yellow-400 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 animate-pulse" /> New Unlocks!
              </h3>
              <div className="space-y-4">
                {newUnlocks.map((item) => (
                  <AchievementCard
                    key={item.achievement.id}
                    achievement={item.achievement}
                    isUnlocked={true}
                    progress={item.progress}
                    unlockedAt={new Date().toISOString()}
                    isGuest={!user}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Level Progress */}
        <Card className="mb-8 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Medal className="w-10 h-10 text-purple-500" />
                <div>
                  <div className="font-bold text-xl text-foreground">
                    Level {stats.level}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stats.levelProgress.current.toLocaleString()} / {stats.levelProgress.needed.toLocaleString()} XP to next level
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-foreground">
                  Level {stats.level + 1}
                </div>
                <div className="text-sm text-muted-foreground">Next Level</div>
              </div>
            </div>
            <div className="w-full bg-muted rounded-full h-4">
              <div
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${stats.levelProgress.progress}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
            <TabsList>
              <TabsTrigger value="all">All ({processedAchievements.length})</TabsTrigger>
              <TabsTrigger value="unlocked">Unlocked ({achievementStats.unlocked})</TabsTrigger>
              <TabsTrigger value="locked">Locked ({achievementStats.total - achievementStats.unlocked})</TabsTrigger>
            </TabsList>
          </Tabs>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="global">Global</SelectItem>
              {achievementCategories
                .filter((c) => c !== 'global')
                .map((category) => (
                  <SelectItem key={category} value={category}>
                    {categoryLabels[category as Category] || category}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
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
                isGuest={!user}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <span className="text-4xl mb-3 block">🔍</span>
              <p className="text-muted-foreground">
                No achievements found with current filters
              </p>
            </CardContent>
          </Card>
        )}

        {/* Not signed in notice */}
        {!user && (
          <Card className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-2 border-dashed border-amber-400 dark:border-amber-600">
            <CardContent className="py-6">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Trophy className="w-10 h-10 text-amber-500" />
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-bold text-amber-900 dark:text-amber-100 mb-1 flex items-center justify-center sm:justify-start gap-2">
                    {achievementStats.unlocked > 0 ? (
                      <>
                        You have {achievementStats.unlocked} unclaimed achievement{achievementStats.unlocked !== 1 ? 's' : ''}!
                      </>
                    ) : (
                      <>Save your progress</>
                    )}
                  </h3>
                  <p className="text-amber-700 dark:text-amber-300 text-sm">
                    {achievementStats.unlocked > 0
                      ? 'Sign in to claim them permanently and sync across all your devices.'
                      : 'Your achievements are stored locally. Sign in to sync across devices and share your profile.'}
                  </p>
                </div>
                <Button asChild className="shrink-0 bg-amber-500 hover:bg-amber-600">
                  <Link href="/" className="gap-2">
                    <LogIn className="w-4 h-4" />
                    Sign In to Claim
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-background/50">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <div className="flex justify-center gap-4 mb-2">
            <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
            <span>|</span>
            <Link href="/settings" className="hover:text-foreground transition-colors">Settings</Link>
            <span>|</span>
            <Link href="/suggest" className="hover:text-foreground transition-colors">Suggest</Link>
            <span>|</span>
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <span>|</span>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
          </div>
          <p>See Every Place - Free Travel Tracker</p>
        </div>
      </footer>
    </div>
  );
}
