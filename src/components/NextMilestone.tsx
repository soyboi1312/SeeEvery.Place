'use client';

import { useMemo } from 'react';
import { Target, Sparkles } from 'lucide-react';
import { UserSelections, categoryLabels, Category } from '@/lib/types';
import {
  ACHIEVEMENTS,
  AchievementDefinition,
  getAchievementProgress,
  calculateTotalXp,
  calculateLevel,
  getTierColor,
} from '@/lib/achievements';

interface NextMilestoneProps {
  selections: UserSelections;
  className?: string;
}

/**
 * Displays the user's next closest achievement milestone
 * Shows the achievement with the highest progress that isn't complete
 */
export function NextMilestone({ selections, className = '' }: NextMilestoneProps) {
  const milestone = useMemo(() => {
    const totalXp = calculateTotalXp(selections);
    const currentLevel = calculateLevel(totalXp);

    // Calculate progress for all achievements
    const achievementsWithProgress = ACHIEVEMENTS.map(achievement => {
      const progress = getAchievementProgress(achievement, selections, currentLevel);
      return {
        achievement,
        progress,
      };
    });

    // Filter to incomplete achievements (less than 100% but at least some progress)
    const incomplete = achievementsWithProgress.filter(
      a => a.progress.percentage < 100 && a.progress.percentage > 0
    );

    if (incomplete.length === 0) {
      // If no in-progress achievements, find the first unstarted one
      const unstarted = achievementsWithProgress.filter(a => a.progress.percentage === 0);
      if (unstarted.length > 0) {
        return unstarted[0];
      }
      return null;
    }

    // Sort by progress (highest first) to find the closest to completion
    incomplete.sort((a, b) => b.progress.percentage - a.progress.percentage);

    return incomplete[0];
  }, [selections]);

  if (!milestone) {
    return null;
  }

  const { achievement, progress } = milestone;
  const remaining = progress.target - progress.current;
  const categoryLabel = achievement.category !== 'global'
    ? categoryLabels[achievement.category as Category]
    : null;

  // Generate motivational message based on progress
  const getMessage = (pct: number, rem: number, ach: AchievementDefinition): string => {
    if (pct >= 90) return `Almost there! Just ${rem} more to go!`;
    if (pct >= 75) return `You're ${rem} away from "${ach.name}"`;
    if (pct >= 50) return `Halfway to "${ach.name}"!`;
    return `${rem} more to unlock "${ach.name}"`;
  };

  return (
    <div className={`bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200 dark:border-amber-800/50 p-4 ${className}`}>
      <div className="flex items-start gap-3">
        {/* Achievement Icon */}
        <div className="flex-shrink-0 text-3xl">{achievement.icon}</div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
              Next Milestone
            </span>
            {progress.percentage >= 75 && (
              <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" />
            )}
          </div>

          {/* Message */}
          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {getMessage(progress.percentage, remaining, achievement)}
          </p>

          {/* Category badge and XP reward */}
          <div className="flex items-center gap-2 mt-1.5">
            {categoryLabel && (
              <span className="text-xs px-1.5 py-0.5 bg-amber-100 dark:bg-amber-800/40 text-amber-700 dark:text-amber-300 rounded">
                {categoryLabel}
              </span>
            )}
            <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
              +{achievement.xpReward} XP
            </span>
            <span className={`text-xs px-1.5 py-0.5 rounded bg-gradient-to-r ${getTierColor(achievement.tier)} text-white`}>
              {achievement.tier}
            </span>
          </div>

          {/* Progress bar */}
          <div className="mt-2">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-600 dark:text-gray-400">
                {progress.current} / {progress.target}
              </span>
              <span className="font-medium text-amber-700 dark:text-amber-400">
                {Math.round(progress.percentage)}%
              </span>
            </div>
            <div className="h-2 bg-amber-100 dark:bg-amber-900/40 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Compact version for use in headers or sidebars
 */
export function NextMilestoneCompact({ selections, className = '' }: NextMilestoneProps) {
  const milestone = useMemo(() => {
    const totalXp = calculateTotalXp(selections);
    const currentLevel = calculateLevel(totalXp);

    const achievementsWithProgress = ACHIEVEMENTS.map(achievement => {
      const progress = getAchievementProgress(achievement, selections, currentLevel);
      return { achievement, progress };
    });

    const incomplete = achievementsWithProgress.filter(
      a => a.progress.percentage < 100 && a.progress.percentage > 0
    );

    if (incomplete.length === 0) return null;

    incomplete.sort((a, b) => b.progress.percentage - a.progress.percentage);
    return incomplete[0];
  }, [selections]);

  if (!milestone) return null;

  const { achievement, progress } = milestone;
  const remaining = progress.target - progress.current;

  return (
    <div className={`flex items-center gap-2 text-sm ${className}`}>
      <Target className="w-4 h-4 text-amber-500" />
      <span className="text-gray-600 dark:text-gray-300">
        <span className="text-lg mr-1">{achievement.icon}</span>
        <strong>{remaining}</strong> to "{achievement.name}"
      </span>
      <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
        {Math.round(progress.percentage)}%
      </span>
    </div>
  );
}

export default NextMilestone;
