/**
 * Time-Bound Challenges & Streaks System
 *
 * This module provides:
 * - Seasonal/time-bound challenges (e.g., "Summer of Parks")
 * - Streak tracking (login streaks, season streaks)
 * - Challenge progress calculation
 */

import { Category } from './types';

// ============================================
// Challenge Types
// ============================================

export type ChallengeType = 'seasonal' | 'limited' | 'recurring_yearly';

export interface Challenge {
  id: string;
  name: string;
  description: string;
  type: ChallengeType;
  category: Category | null; // null = any category
  targetPlaceIds: string[] | null; // null = any place in category
  requiredCount: number;
  startDate: Date;
  endDate: Date | null;
  // For recurring yearly challenges
  startMonth?: number; // 1-12
  endMonth?: number; // 1-12
  badgeIcon: string;
  badgeName: string;
  xpReward: number;
  isActive: boolean;
  isSecret: boolean;
}

export interface UserChallengeProgress {
  challengeId: string;
  currentCount: number;
  completedAt: Date | null;
  year?: number; // For recurring challenges
}

export interface ChallengeWithProgress extends Challenge {
  progress: number; // 0-100
  currentCount: number;
  isCompleted: boolean;
  daysRemaining: number | null;
}

// ============================================
// Streak Types
// ============================================

export interface UserStreaks {
  // Login streaks
  currentLoginStreak: number;
  longestLoginStreak: number;
  lastLoginDate: Date | null;
  // Season streaks (visited at least one place per month)
  currentSeasonStreak: number;
  longestSeasonStreak: number;
  lastVisitMonth: Date | null;
  // Monthly visit counts for the current year
  monthlyVisits: Record<string, number>; // "2024-01" -> count
}

export interface StreakAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: {
    type: 'login_streak' | 'season_streak';
    count: number;
  };
  xpReward: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'legendary';
}

// ============================================
// Pre-defined Challenges (Client-side reference)
// These match the database seed data
// ============================================

export const PREDEFINED_CHALLENGES: Omit<Challenge, 'id' | 'isActive'>[] = [
  {
    name: 'Summer of Parks',
    description: 'Visit 3 State Parks between June and August',
    type: 'recurring_yearly',
    category: 'stateParks',
    targetPlaceIds: null,
    requiredCount: 3,
    startDate: new Date('2024-06-01'),
    endDate: null,
    startMonth: 6,
    endMonth: 8,
    badgeIcon: '🌲',
    badgeName: 'Summer Explorer',
    xpReward: 200,
    isSecret: false,
  },
  {
    name: 'National Park Summer',
    description: 'Visit 2 National Parks during summer',
    type: 'recurring_yearly',
    category: 'nationalParks',
    targetPlaceIds: null,
    requiredCount: 2,
    startDate: new Date('2024-06-01'),
    endDate: null,
    startMonth: 6,
    endMonth: 8,
    badgeIcon: '🏞️',
    badgeName: 'Park Ranger Summer',
    xpReward: 300,
    isSecret: false,
  },
  {
    name: 'Powder Season',
    description: 'Hit 3 ski resorts during winter',
    type: 'recurring_yearly',
    category: 'skiResorts',
    targetPlaceIds: null,
    requiredCount: 3,
    startDate: new Date('2024-12-01'),
    endDate: null,
    startMonth: 12,
    endMonth: 3,
    badgeIcon: '⛷️',
    badgeName: 'Powder Hound',
    xpReward: 250,
    isSecret: false,
  },
  {
    name: 'Baseball Season Tour',
    description: 'Visit 5 MLB stadiums during the season (April-October)',
    type: 'recurring_yearly',
    category: 'mlbStadiums',
    targetPlaceIds: null,
    requiredCount: 5,
    startDate: new Date('2024-04-01'),
    endDate: null,
    startMonth: 4,
    endMonth: 10,
    badgeIcon: '⚾',
    badgeName: 'Diamond Chaser',
    xpReward: 300,
    isSecret: false,
  },
  {
    name: 'Fall Colors',
    description: 'Visit 2 State Parks during fall foliage season',
    type: 'recurring_yearly',
    category: 'stateParks',
    targetPlaceIds: null,
    requiredCount: 2,
    startDate: new Date('2024-09-01'),
    endDate: null,
    startMonth: 9,
    endMonth: 11,
    badgeIcon: '🍂',
    badgeName: 'Leaf Peeper',
    xpReward: 150,
    isSecret: false,
  },
  {
    name: 'Four Seasons Explorer',
    description: 'Visit places in all four seasons (any category)',
    type: 'recurring_yearly',
    category: null,
    targetPlaceIds: null,
    requiredCount: 12,
    startDate: new Date('2024-01-01'),
    endDate: null,
    badgeIcon: '🌍',
    badgeName: 'Year-Round Explorer',
    xpReward: 500,
    isSecret: false,
  },
];

// ============================================
// Streak Achievements
// ============================================

export const STREAK_ACHIEVEMENTS: StreakAchievement[] = [
  // Login Streaks
  {
    id: 'login_streak_3',
    name: 'Curious Explorer',
    description: 'Log in 3 days in a row',
    icon: '📅',
    requirement: { type: 'login_streak', count: 3 },
    xpReward: 50,
    tier: 'bronze',
  },
  {
    id: 'login_streak_7',
    name: 'Weekly Wanderer',
    description: 'Log in 7 days in a row',
    icon: '🗓️',
    requirement: { type: 'login_streak', count: 7 },
    xpReward: 100,
    tier: 'bronze',
  },
  {
    id: 'login_streak_14',
    name: 'Dedicated Traveler',
    description: 'Log in 14 days in a row',
    icon: '📆',
    requirement: { type: 'login_streak', count: 14 },
    xpReward: 200,
    tier: 'silver',
  },
  {
    id: 'login_streak_30',
    name: 'Monthly Mapper',
    description: 'Log in 30 days in a row',
    icon: '🗺️',
    requirement: { type: 'login_streak', count: 30 },
    xpReward: 400,
    tier: 'gold',
  },
  {
    id: 'login_streak_90',
    name: 'Quarterly Quest',
    description: 'Log in 90 days in a row',
    icon: '🏆',
    requirement: { type: 'login_streak', count: 90 },
    xpReward: 1000,
    tier: 'platinum',
  },
  {
    id: 'login_streak_365',
    name: 'Year of Exploration',
    description: 'Log in 365 days in a row',
    icon: '👑',
    requirement: { type: 'login_streak', count: 365 },
    xpReward: 3000,
    tier: 'legendary',
  },

  // Season Streaks (visits per month)
  {
    id: 'season_streak_3',
    name: 'Seasonal Traveler',
    description: 'Visit at least one place for 3 months in a row',
    icon: '🌱',
    requirement: { type: 'season_streak', count: 3 },
    xpReward: 150,
    tier: 'bronze',
  },
  {
    id: 'season_streak_6',
    name: 'Half-Year Hero',
    description: 'Visit at least one place for 6 months in a row',
    icon: '🌻',
    requirement: { type: 'season_streak', count: 6 },
    xpReward: 350,
    tier: 'silver',
  },
  {
    id: 'season_streak_12',
    name: 'Year-Round Adventurer',
    description: 'Visit at least one place every month for a year',
    icon: '🎄',
    requirement: { type: 'season_streak', count: 12 },
    xpReward: 800,
    tier: 'gold',
  },
  {
    id: 'season_streak_24',
    name: 'Two-Year Trek',
    description: 'Visit at least one place every month for 2 years',
    icon: '⭐',
    requirement: { type: 'season_streak', count: 24 },
    xpReward: 2000,
    tier: 'platinum',
  },
];

// ============================================
// Helper Functions
// ============================================

/**
 * Check if a date falls within a challenge's active period
 */
export function isDateInChallengePeriod(
  date: Date,
  challenge: Challenge
): boolean {
  // Check absolute date bounds
  if (date < challenge.startDate) return false;
  if (challenge.endDate && date > challenge.endDate) return false;

  // For recurring yearly challenges, check month bounds
  if (challenge.type === 'recurring_yearly' && challenge.startMonth && challenge.endMonth) {
    const month = date.getMonth() + 1; // 1-12

    if (challenge.startMonth <= challenge.endMonth) {
      // Normal range (e.g., June to August: 6-8)
      return month >= challenge.startMonth && month <= challenge.endMonth;
    } else {
      // Wrapping range (e.g., December to February: 12-2)
      return month >= challenge.startMonth || month <= challenge.endMonth;
    }
  }

  return true;
}

/**
 * Get the current challenge year for recurring challenges
 */
export function getChallengeYear(date: Date, challenge: Challenge): number {
  if (challenge.type !== 'recurring_yearly') {
    return date.getFullYear();
  }

  // For challenges that wrap around (e.g., Dec-Feb), the year is based on start month
  if (challenge.startMonth && challenge.endMonth && challenge.startMonth > challenge.endMonth) {
    const month = date.getMonth() + 1;
    // If we're in the early months (after wrap), use previous year
    if (month <= challenge.endMonth) {
      return date.getFullYear() - 1;
    }
  }

  return date.getFullYear();
}

/**
 * Calculate days remaining for a challenge
 */
export function getDaysRemaining(challenge: Challenge): number | null {
  if (!challenge.endDate) {
    // For recurring challenges without end date, calculate days until end of season
    if (challenge.type === 'recurring_yearly' && challenge.endMonth) {
      const now = new Date();
      const year = getChallengeYear(now, challenge);
      let endMonth = challenge.endMonth;
      let endYear = year;

      // Handle year wrap
      if (challenge.startMonth && challenge.startMonth > challenge.endMonth) {
        endYear = year + 1;
      }

      const endDate = new Date(endYear, endMonth, 0); // Last day of end month
      const diff = endDate.getTime() - now.getTime();
      return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    }
    return null;
  }

  const now = new Date();
  const diff = challenge.endDate.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

/**
 * Check if a challenge is currently active (within time window)
 */
export function isChallengeActive(challenge: Challenge): boolean {
  if (!challenge.isActive) return false;

  const now = new Date();
  return isDateInChallengePeriod(now, challenge);
}

/**
 * Get the season name for display
 */
export function getSeasonName(startMonth?: number, endMonth?: number): string {
  if (!startMonth || !endMonth) return 'Year-Round';

  // Summer
  if (startMonth === 6 && endMonth === 8) return 'Summer';
  // Winter (wrapping)
  if (startMonth === 12 && endMonth === 3) return 'Winter';
  // Fall
  if (startMonth === 9 && endMonth === 11) return 'Fall';
  // Spring
  if (startMonth === 3 && endMonth === 5) return 'Spring';
  // Baseball season
  if (startMonth === 4 && endMonth === 10) return 'Season';

  return `${getMonthName(startMonth)} - ${getMonthName(endMonth)}`;
}

function getMonthName(month: number): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[month - 1] || '';
}

/**
 * Calculate progress percentage for a challenge
 */
export function calculateChallengeProgress(
  currentCount: number,
  requiredCount: number
): number {
  return Math.min(100, Math.round((currentCount / requiredCount) * 100));
}

/**
 * Get unlocked streak achievements based on current streaks
 */
export function getUnlockedStreakAchievements(
  streaks: UserStreaks,
  alreadyUnlocked: string[]
): StreakAchievement[] {
  return STREAK_ACHIEVEMENTS.filter(achievement => {
    if (alreadyUnlocked.includes(achievement.id)) return false;

    const { type, count } = achievement.requirement;

    if (type === 'login_streak') {
      return streaks.longestLoginStreak >= count;
    }

    if (type === 'season_streak') {
      return streaks.longestSeasonStreak >= count;
    }

    return false;
  });
}

/**
 * Get the tier color for a streak achievement
 */
export function getStreakTierColor(tier: StreakAchievement['tier']): string {
  switch (tier) {
    case 'bronze': return 'from-amber-600 to-amber-800';
    case 'silver': return 'from-slate-300 to-slate-500';
    case 'gold': return 'from-yellow-400 to-yellow-600';
    case 'platinum': return 'from-cyan-300 to-cyan-500';
    case 'legendary': return 'from-purple-500 to-pink-500';
    default: return 'from-gray-400 to-gray-600';
  }
}

/**
 * Format streak count for display
 */
export function formatStreakCount(count: number, type: 'days' | 'months'): string {
  if (type === 'days') {
    if (count === 1) return '1 day';
    return `${count} days`;
  }
  if (count === 1) return '1 month';
  return `${count} months`;
}
