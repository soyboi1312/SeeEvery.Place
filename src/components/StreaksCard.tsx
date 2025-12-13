'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, Calendar, TrendingUp, Award } from 'lucide-react';

interface StreakMilestone {
  name: string;
  required: number;
  progress: number;
}

interface StreakAchievement {
  id: string;
  name: string;
  icon: string;
  tier: string;
}

interface StreakData {
  currentLoginStreak: number;
  longestLoginStreak: number;
  lastLoginDate: string | null;
  currentSeasonStreak: number;
  longestSeasonStreak: number;
  monthlyVisits: Record<string, number>;
  streakAchievements: StreakAchievement[];
  nextLoginMilestone: StreakMilestone | null;
  nextSeasonMilestone: StreakMilestone | null;
}

interface StreaksCardProps {
  className?: string;
  compact?: boolean;
}

/**
 * Displays user streak information
 */
export function StreaksCard({ className = '', compact = false }: StreaksCardProps) {
  const [streaks, setStreaks] = useState<StreakData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStreaks() {
      try {
        const response = await fetch('/api/streaks');
        if (response.status === 401) {
          // Not authenticated - don't show streaks
          setError('not_authenticated');
          return;
        }
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setStreaks(data);
      } catch (err) {
        setError('failed');
      } finally {
        setLoading(false);
      }
    }

    fetchStreaks();
  }, []);

  // Record login on mount
  useEffect(() => {
    async function recordLogin() {
      try {
        await fetch('/api/streaks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'login' }),
        });
      } catch {
        // Silently fail
      }
    }

    recordLogin();
  }, []);

  if (loading) {
    return compact ? null : (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Flame className="w-5 h-5 text-orange-500" />
            Your Streaks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error === 'not_authenticated') {
    return null; // Don't show streaks for unauthenticated users
  }

  if (error || !streaks) {
    return null;
  }

  // Compact version for header/sidebar
  if (compact) {
    return (
      <div className={`flex items-center gap-4 ${className}`}>
        {streaks.currentLoginStreak > 0 && (
          <div className="flex items-center gap-1.5">
            <Flame className={`w-4 h-4 ${streaks.currentLoginStreak >= 7 ? 'text-orange-500' : 'text-slate-400'}`} />
            <span className="text-sm font-medium">{streaks.currentLoginStreak} day streak</span>
          </div>
        )}
        {streaks.currentSeasonStreak > 0 && (
          <div className="flex items-center gap-1.5">
            <Calendar className={`w-4 h-4 ${streaks.currentSeasonStreak >= 3 ? 'text-green-500' : 'text-slate-400'}`} />
            <span className="text-sm font-medium">{streaks.currentSeasonStreak} month streak</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Flame className="w-5 h-5 text-orange-500" />
          Your Streaks
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Login Streak */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${streaks.currentLoginStreak >= 7 ? 'bg-orange-100 dark:bg-orange-900/30' : 'bg-slate-100 dark:bg-slate-800'}`}>
              <Flame className={`w-5 h-5 ${streaks.currentLoginStreak >= 7 ? 'text-orange-500' : 'text-slate-400'}`} />
            </div>
            <div>
              <p className="font-medium text-sm">Login Streak</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Check in daily to build your streak
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-lg">{streaks.currentLoginStreak}</p>
            <p className="text-xs text-slate-500">
              Best: {streaks.longestLoginStreak}
            </p>
          </div>
        </div>

        {/* Login milestone progress */}
        {streaks.nextLoginMilestone && (
          <div className="pl-11">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-500">Next: {streaks.nextLoginMilestone.name}</span>
              <span className="text-slate-400">{streaks.currentLoginStreak}/{streaks.nextLoginMilestone.required}</span>
            </div>
            <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500 transition-all duration-500"
                style={{ width: `${streaks.nextLoginMilestone.progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="border-t dark:border-slate-700" />

        {/* Season Streak */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${streaks.currentSeasonStreak >= 3 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-slate-100 dark:bg-slate-800'}`}>
              <Calendar className={`w-5 h-5 ${streaks.currentSeasonStreak >= 3 ? 'text-green-500' : 'text-slate-400'}`} />
            </div>
            <div>
              <p className="font-medium text-sm">Season Streak</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Visit at least one place per month
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-lg">{streaks.currentSeasonStreak}</p>
            <p className="text-xs text-slate-500">
              Best: {streaks.longestSeasonStreak}
            </p>
          </div>
        </div>

        {/* Season milestone progress */}
        {streaks.nextSeasonMilestone && (
          <div className="pl-11">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-500">Next: {streaks.nextSeasonMilestone.name}</span>
              <span className="text-slate-400">{streaks.currentSeasonStreak}/{streaks.nextSeasonMilestone.required}</span>
            </div>
            <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all duration-500"
                style={{ width: `${streaks.nextSeasonMilestone.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Unlocked streak achievements */}
        {streaks.streakAchievements.length > 0 && (
          <>
            <div className="border-t dark:border-slate-700" />
            <div>
              <p className="text-xs text-slate-500 mb-2 flex items-center gap-1">
                <Award className="w-3 h-3" />
                Streak Achievements
              </p>
              <div className="flex flex-wrap gap-2">
                {streaks.streakAchievements.map(achievement => (
                  <Badge
                    key={achievement.id}
                    variant="secondary"
                    className="text-xs"
                  >
                    {achievement.icon} {achievement.name}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Inline streak display for header
 */
export function StreaksBadge({ className = '' }: { className?: string }) {
  const [streak, setStreak] = useState<number | null>(null);

  useEffect(() => {
    async function fetchStreak() {
      try {
        const response = await fetch('/api/streaks');
        if (!response.ok) return;
        const data = await response.json();
        if (data.currentLoginStreak > 0) {
          setStreak(data.currentLoginStreak);
        }
      } catch {
        // Silently fail
      }
    }

    // Also record the login
    fetch('/api/streaks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'login' }),
    }).catch(() => {});

    fetchStreak();
  }, []);

  if (streak === null) return null;

  return (
    <Badge
      variant="outline"
      className={`text-orange-600 border-orange-300 dark:border-orange-700 ${className}`}
    >
      <Flame className="w-3 h-3 mr-1" />
      {streak}
    </Badge>
  );
}

export default StreaksCard;
