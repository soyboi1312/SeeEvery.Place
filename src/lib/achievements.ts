/**
 * Achievements System
 * Defines all achievements, XP values, and progress tracking logic
 *
 * NOTE: XP values and totals are derived from CATEGORY_SCHEMA (types.ts)
 * This avoids importing all data files and causing bundle bloat
 */

import { Category, UserSelections, ALL_CATEGORIES, CATEGORY_SCHEMA } from './types';
import { getCategoryTotal } from './categoryUtils';

// ============================================
// XP Values per category item (derived from schema)
// ============================================
export const XP_VALUES: Record<Category, number> = Object.fromEntries(
  Object.entries(CATEGORY_SCHEMA).map(([k, v]) => [k, v.xp])
) as Record<Category, number>;

// ============================================
// Category totals for completion tracking (derived from schema/cache)
// ============================================
export function getCategoryTotals(): Record<Category, number> {
  // Use getCategoryTotal which checks cache first, then falls back to schema
  return Object.fromEntries(
    ALL_CATEGORIES.map(cat => [cat, getCategoryTotal(cat)])
  ) as Record<Category, number>;
}

// ============================================
// Achievement Types
// ============================================
export type AchievementTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'legendary';

export interface AchievementDefinition {
  id: string;
  name: string;
  description: string;
  category: Category | 'global';  // Which category it applies to, or 'global' for cross-category
  tier: AchievementTier;
  xpReward: number;
  requirement: AchievementRequirement;
  icon: string;  // Emoji for quick display
}

export type AchievementRequirement =
  | { type: 'visited_count'; count: number }
  | { type: 'percentage'; percentage: number }
  | { type: 'total_visited'; count: number }  // Across all categories
  | { type: 'categories_started'; count: number }  // Number of categories with at least 1 visit
  | { type: 'completionist'; category: Category }  // 100% a category
  | { type: 'level'; level: number }
  | { type: 'login_streak'; count: number }  // Login streak days
  | { type: 'season_streak'; count: number };  // Season streak months

export interface UnlockedAchievement {
  id: string;
  unlockedAt: string;  // ISO date string
  category?: Category;
  progressSnapshot?: {
    visited: number;
    total: number;
    percentage: number;
  };
}

// ============================================
// Achievement Definitions
// ============================================
export const ACHIEVEMENTS: AchievementDefinition[] = [
  // ============================================
  // GLOBAL ACHIEVEMENTS
  // ============================================
  {
    id: 'first_steps',
    name: 'First Steps',
    description: 'Mark your first place as visited',
    category: 'global',
    tier: 'bronze',
    xpReward: 50,
    requirement: { type: 'total_visited', count: 1 },
    icon: '👣',
  },
  {
    id: 'getting_started',
    name: 'Getting Started',
    description: 'Visit 10 places across any categories',
    category: 'global',
    tier: 'bronze',
    xpReward: 100,
    requirement: { type: 'total_visited', count: 10 },
    icon: '🚀',
  },
  {
    id: 'explorer',
    name: 'Explorer',
    description: 'Visit 50 places across any categories',
    category: 'global',
    tier: 'silver',
    xpReward: 250,
    requirement: { type: 'total_visited', count: 50 },
    icon: '🧭',
  },
  {
    id: 'adventurer',
    name: 'Adventurer',
    description: 'Visit 100 places across any categories',
    category: 'global',
    tier: 'gold',
    xpReward: 500,
    requirement: { type: 'total_visited', count: 100 },
    icon: '🗺️',
  },
  {
    id: 'globetrotter',
    name: 'Globetrotter',
    description: 'Visit 250 places across any categories',
    category: 'global',
    tier: 'platinum',
    xpReward: 1000,
    requirement: { type: 'total_visited', count: 250 },
    icon: '🌐',
  },
  {
    id: 'legend',
    name: 'Living Legend',
    description: 'Visit 500 places across any categories',
    category: 'global',
    tier: 'legendary',
    xpReward: 2500,
    requirement: { type: 'total_visited', count: 500 },
    icon: '👑',
  },
  {
    id: 'variety_seeker',
    name: 'Variety Seeker',
    description: 'Start tracking in 5 different categories',
    category: 'global',
    tier: 'bronze',
    xpReward: 150,
    requirement: { type: 'categories_started', count: 5 },
    icon: '🎯',
  },
  {
    id: 'renaissance_traveler',
    name: 'Renaissance Traveler',
    description: 'Start tracking in 10 different categories',
    category: 'global',
    tier: 'silver',
    xpReward: 300,
    requirement: { type: 'categories_started', count: 10 },
    icon: '🎨',
  },
  {
    id: 'master_collector',
    name: 'Master Collector',
    description: 'Start tracking in all categories',
    category: 'global',
    tier: 'gold',
    xpReward: 750,
    requirement: { type: 'categories_started', count: ALL_CATEGORIES.length },
    icon: '🏅',
  },

  // ============================================
  // COUNTRIES ACHIEVEMENTS
  // ============================================
  {
    id: 'countries_5',
    name: 'Passport Stamper',
    description: 'Visit 5 countries',
    category: 'countries',
    tier: 'bronze',
    xpReward: 100,
    requirement: { type: 'visited_count', count: 5 },
    icon: '🛂',
  },
  {
    id: 'countries_10',
    name: 'Border Hopper',
    description: 'Visit 10 countries',
    category: 'countries',
    tier: 'bronze',
    xpReward: 200,
    requirement: { type: 'visited_count', count: 10 },
    icon: '✈️',
  },
  {
    id: 'countries_25',
    name: 'International Traveler',
    description: 'Visit 25 countries',
    category: 'countries',
    tier: 'silver',
    xpReward: 400,
    requirement: { type: 'visited_count', count: 25 },
    icon: '🌍',
  },
  {
    id: 'countries_50',
    name: 'World Traveler',
    description: 'Visit 50 countries',
    category: 'countries',
    tier: 'gold',
    xpReward: 750,
    requirement: { type: 'visited_count', count: 50 },
    icon: '🌏',
  },
  {
    id: 'countries_100',
    name: 'Global Citizen',
    description: 'Visit 100 countries',
    category: 'countries',
    tier: 'platinum',
    xpReward: 1500,
    requirement: { type: 'visited_count', count: 100 },
    icon: '🌎',
  },
  {
    id: 'countries_complete',
    name: 'The Completionist: Countries',
    description: 'Visit every country in the world',
    category: 'countries',
    tier: 'legendary',
    xpReward: 5000,
    requirement: { type: 'completionist', category: 'countries' },
    icon: '🏆',
  },

  // ============================================
  // US STATES ACHIEVEMENTS
  // ============================================
  {
    id: 'states_10',
    name: 'State Hopper',
    description: 'Visit 10 US states',
    category: 'states',
    tier: 'bronze',
    xpReward: 100,
    requirement: { type: 'visited_count', count: 10 },
    icon: '🚗',
  },
  {
    id: 'states_25',
    name: 'Road Tripper',
    description: 'Visit 25 US states',
    category: 'states',
    tier: 'silver',
    xpReward: 300,
    requirement: { type: 'visited_count', count: 25 },
    icon: '🛣️',
  },
  {
    id: 'states_40',
    name: 'Coast to Coast',
    description: 'Visit 40 US states',
    category: 'states',
    tier: 'gold',
    xpReward: 600,
    requirement: { type: 'visited_count', count: 40 },
    icon: '🇺🇸',
  },
  {
    id: 'states_complete',
    name: 'All 50 States',
    description: 'Visit all 50 US states',
    category: 'states',
    tier: 'platinum',
    xpReward: 1000,
    requirement: { type: 'completionist', category: 'states' },
    icon: '⭐',
  },

  // ============================================
  // NATIONAL PARKS ACHIEVEMENTS
  // ============================================
  {
    id: 'parks_5',
    name: 'Park Explorer',
    description: 'Visit 5 national parks',
    category: 'nationalParks',
    tier: 'bronze',
    xpReward: 150,
    requirement: { type: 'visited_count', count: 5 },
    icon: '🌲',
  },
  {
    id: 'parks_15',
    name: 'Nature Lover',
    description: 'Visit 15 national parks',
    category: 'nationalParks',
    tier: 'silver',
    xpReward: 350,
    requirement: { type: 'visited_count', count: 15 },
    icon: '🏞️',
  },
  {
    id: 'parks_30',
    name: 'Park Ranger',
    description: 'Visit 30 national parks',
    category: 'nationalParks',
    tier: 'gold',
    xpReward: 600,
    requirement: { type: 'visited_count', count: 30 },
    icon: '🏕️',
  },
  {
    id: 'parks_complete',
    name: 'The Ultimate Park Ranger',
    description: 'Visit every national park',
    category: 'nationalParks',
    tier: 'legendary',
    xpReward: 2000,
    requirement: { type: 'completionist', category: 'nationalParks' },
    icon: '🦬',
  },

  // ============================================
  // MOUNTAINS ACHIEVEMENTS
  // ============================================
  {
    id: 'peaks_5',
    name: 'Summit Starter',
    description: 'Climb 5 peaks over 5000m',
    category: 'fiveKPeaks',
    tier: 'silver',
    xpReward: 300,
    requirement: { type: 'visited_count', count: 5 },
    icon: '🏔️',
  },
  {
    id: 'peaks_10',
    name: 'Summit Seeker',
    description: 'Climb 10 peaks over 5000m',
    category: 'fiveKPeaks',
    tier: 'gold',
    xpReward: 600,
    requirement: { type: 'visited_count', count: 10 },
    icon: '⛰️',
  },
  {
    id: 'fourteeners_10',
    name: '14er Enthusiast',
    description: 'Climb 10 Colorado 14ers',
    category: 'fourteeners',
    tier: 'silver',
    xpReward: 400,
    requirement: { type: 'visited_count', count: 10 },
    icon: '🥾',
  },
  {
    id: 'fourteeners_complete',
    name: '14er Completionist',
    description: 'Climb all Colorado 14ers',
    category: 'fourteeners',
    tier: 'legendary',
    xpReward: 2500,
    requirement: { type: 'completionist', category: 'fourteeners' },
    icon: '🦅',
  },

  // ============================================
  // SPORTS STADIUMS ACHIEVEMENTS
  // ============================================
  {
    id: 'mlb_10',
    name: 'Baseball Fan',
    description: 'Visit 10 MLB stadiums',
    category: 'mlbStadiums',
    tier: 'silver',
    xpReward: 300,
    requirement: { type: 'visited_count', count: 10 },
    icon: '⚾',
  },
  {
    id: 'mlb_complete',
    name: 'MLB Grand Slam',
    description: 'Visit every MLB stadium',
    category: 'mlbStadiums',
    tier: 'gold',
    xpReward: 1000,
    requirement: { type: 'completionist', category: 'mlbStadiums' },
    icon: '🏆',
  },
  {
    id: 'nfl_10',
    name: 'Football Fanatic',
    description: 'Visit 10 NFL stadiums',
    category: 'nflStadiums',
    tier: 'silver',
    xpReward: 300,
    requirement: { type: 'visited_count', count: 10 },
    icon: '🏈',
  },
  {
    id: 'nfl_complete',
    name: 'NFL Touchdown Tour',
    description: 'Visit every NFL stadium',
    category: 'nflStadiums',
    tier: 'gold',
    xpReward: 1000,
    requirement: { type: 'completionist', category: 'nflStadiums' },
    icon: '🏆',
  },
  {
    id: 'nba_10',
    name: 'Hoops Hunter',
    description: 'Visit 10 NBA arenas',
    category: 'nbaStadiums',
    tier: 'silver',
    xpReward: 300,
    requirement: { type: 'visited_count', count: 10 },
    icon: '🏀',
  },
  {
    id: 'nba_complete',
    name: 'NBA Arena Tour',
    description: 'Visit every NBA arena',
    category: 'nbaStadiums',
    tier: 'gold',
    xpReward: 1000,
    requirement: { type: 'completionist', category: 'nbaStadiums' },
    icon: '🏆',
  },

  // ============================================
  // F1 & MOTORSPORT ACHIEVEMENTS
  // ============================================
  {
    id: 'f1_5',
    name: 'Racing Fan',
    description: 'Visit 5 F1 circuits',
    category: 'f1Tracks',
    tier: 'silver',
    xpReward: 250,
    requirement: { type: 'visited_count', count: 5 },
    icon: '🏎️',
  },
  {
    id: 'f1_10',
    name: 'F1 Fanatic',
    description: 'Visit 10 F1 circuits',
    category: 'f1Tracks',
    tier: 'gold',
    xpReward: 500,
    requirement: { type: 'visited_count', count: 10 },
    icon: '🏁',
  },
  {
    id: 'f1_complete',
    name: 'F1 World Champion',
    description: 'Visit every F1 circuit',
    category: 'f1Tracks',
    tier: 'legendary',
    xpReward: 1500,
    requirement: { type: 'completionist', category: 'f1Tracks' },
    icon: '🏆',
  },

  // ============================================
  // SKI RESORTS ACHIEVEMENTS
  // ============================================
  {
    id: 'ski_5',
    name: 'Ski Bunny',
    description: 'Visit 5 ski resorts',
    category: 'skiResorts',
    tier: 'bronze',
    xpReward: 150,
    requirement: { type: 'visited_count', count: 5 },
    icon: '🎿',
  },
  {
    id: 'ski_15',
    name: 'Powder Chaser',
    description: 'Visit 15 ski resorts',
    category: 'skiResorts',
    tier: 'silver',
    xpReward: 400,
    requirement: { type: 'visited_count', count: 15 },
    icon: '⛷️',
  },
  {
    id: 'ski_30',
    name: 'Ski Bum',
    description: 'Visit 30 ski resorts',
    category: 'skiResorts',
    tier: 'gold',
    xpReward: 750,
    requirement: { type: 'visited_count', count: 30 },
    icon: '🏔️',
  },

  // ============================================
  // MUSEUMS ACHIEVEMENTS
  // ============================================
  {
    id: 'museums_10',
    name: 'Culture Vulture',
    description: 'Visit 10 world-class museums',
    category: 'museums',
    tier: 'silver',
    xpReward: 250,
    requirement: { type: 'visited_count', count: 10 },
    icon: '🎨',
  },
  {
    id: 'museums_25',
    name: 'Art Aficionado',
    description: 'Visit 25 world-class museums',
    category: 'museums',
    tier: 'gold',
    xpReward: 500,
    requirement: { type: 'visited_count', count: 25 },
    icon: '🖼️',
  },

  // ============================================
  // THEME PARKS ACHIEVEMENTS
  // ============================================
  {
    id: 'theme_5',
    name: 'Thrill Seeker',
    description: 'Visit 5 theme parks',
    category: 'themeParks',
    tier: 'bronze',
    xpReward: 150,
    requirement: { type: 'visited_count', count: 5 },
    icon: '🎢',
  },
  {
    id: 'theme_15',
    name: 'Coaster Enthusiast',
    description: 'Visit 15 theme parks',
    category: 'themeParks',
    tier: 'silver',
    xpReward: 400,
    requirement: { type: 'visited_count', count: 15 },
    icon: '🎠',
  },

  // ============================================
  // WEIRD AMERICANA ACHIEVEMENTS
  // ============================================
  {
    id: 'weird_10',
    name: 'Roadside Tourist',
    description: 'Visit 10 Weird Americana spots',
    category: 'weirdAmericana',
    tier: 'bronze',
    xpReward: 150,
    requirement: { type: 'visited_count', count: 10 },
    icon: '🗿',
  },
  {
    id: 'weird_25',
    name: 'Americana Aficionado',
    description: 'Visit 25 Weird Americana spots',
    category: 'weirdAmericana',
    tier: 'silver',
    xpReward: 350,
    requirement: { type: 'visited_count', count: 25 },
    icon: '🦩',
  },
  {
    id: 'weird_complete',
    name: 'Weird & Wonderful',
    description: 'Visit every Weird Americana spot',
    category: 'weirdAmericana',
    tier: 'gold',
    xpReward: 1000,
    requirement: { type: 'completionist', category: 'weirdAmericana' },
    icon: '🏆',
  },

  // ============================================
  // MARATHON ACHIEVEMENTS
  // ============================================
  {
    id: 'marathon_1',
    name: 'Marathon Runner',
    description: 'Complete a World Marathon Major',
    category: 'marathons',
    tier: 'gold',
    xpReward: 500,
    requirement: { type: 'visited_count', count: 1 },
    icon: '🏃',
  },
  {
    id: 'marathon_3',
    name: 'Triple Crown Runner',
    description: 'Complete 3 World Marathon Majors',
    category: 'marathons',
    tier: 'platinum',
    xpReward: 1000,
    requirement: { type: 'visited_count', count: 3 },
    icon: '🥇',
  },
  {
    id: 'marathon_complete',
    name: 'Six Star Finisher',
    description: 'Complete all World Marathon Majors',
    category: 'marathons',
    tier: 'legendary',
    xpReward: 3000,
    requirement: { type: 'completionist', category: 'marathons' },
    icon: '⭐',
  },

  // ============================================
  // LEVEL ACHIEVEMENTS
  // ============================================
  {
    id: 'level_5',
    name: 'Rising Traveler',
    description: 'Reach Level 5',
    category: 'global',
    tier: 'bronze',
    xpReward: 100,
    requirement: { type: 'level', level: 5 },
    icon: '📈',
  },
  {
    id: 'level_10',
    name: 'Seasoned Explorer',
    description: 'Reach Level 10',
    category: 'global',
    tier: 'silver',
    xpReward: 250,
    requirement: { type: 'level', level: 10 },
    icon: '📊',
  },
  {
    id: 'level_25',
    name: 'Elite Traveler',
    description: 'Reach Level 25',
    category: 'global',
    tier: 'gold',
    xpReward: 500,
    requirement: { type: 'level', level: 25 },
    icon: '🎖️',
  },
  {
    id: 'level_50',
    name: 'Travel Legend',
    description: 'Reach Level 50',
    category: 'global',
    tier: 'platinum',
    xpReward: 1000,
    requirement: { type: 'level', level: 50 },
    icon: '🌟',
  },

  // ============================================
  // STREAK ACHIEVEMENTS
  // ============================================
  {
    id: 'login_streak_7',
    name: 'Weekly Wanderer',
    description: 'Log in 7 days in a row',
    category: 'global',
    tier: 'bronze',
    xpReward: 100,
    requirement: { type: 'login_streak', count: 7 },
    icon: '🗓️',
  },
  {
    id: 'login_streak_30',
    name: 'Monthly Mapper',
    description: 'Log in 30 days in a row',
    category: 'global',
    tier: 'silver',
    xpReward: 400,
    requirement: { type: 'login_streak', count: 30 },
    icon: '🗺️',
  },
  {
    id: 'login_streak_90',
    name: 'Quarterly Quest',
    description: 'Log in 90 days in a row',
    category: 'global',
    tier: 'gold',
    xpReward: 1000,
    requirement: { type: 'login_streak', count: 90 },
    icon: '🏆',
  },
  {
    id: 'login_streak_365',
    name: 'Year of Exploration',
    description: 'Log in 365 days in a row',
    category: 'global',
    tier: 'legendary',
    xpReward: 3000,
    requirement: { type: 'login_streak', count: 365 },
    icon: '👑',
  },
  {
    id: 'season_streak_3',
    name: 'Seasonal Traveler',
    description: 'Visit at least one place for 3 months in a row',
    category: 'global',
    tier: 'bronze',
    xpReward: 150,
    requirement: { type: 'season_streak', count: 3 },
    icon: '🌱',
  },
  {
    id: 'season_streak_6',
    name: 'Half-Year Hero',
    description: 'Visit at least one place for 6 months in a row',
    category: 'global',
    tier: 'silver',
    xpReward: 350,
    requirement: { type: 'season_streak', count: 6 },
    icon: '🌻',
  },
  {
    id: 'season_streak_12',
    name: 'Year-Round Adventurer',
    description: 'Visit at least one place every month for a year',
    category: 'global',
    tier: 'gold',
    xpReward: 800,
    requirement: { type: 'season_streak', count: 12 },
    icon: '🎄',
  },

  // ============================================
  // SECRET ACHIEVEMENTS (Hidden until unlocked)
  // ============================================
  {
    id: 'secret_42',
    name: 'The Answer',
    description: 'Visit exactly 42 countries - the answer to life, the universe, and everything',
    category: 'countries',
    tier: 'legendary',
    xpReward: 420,
    requirement: { type: 'visited_count', count: 42 },
    icon: '🌌',
  },
  {
    id: 'secret_perfectionist',
    name: 'Perfectionist',
    description: 'Complete 5 different categories at 100%',
    category: 'global',
    tier: 'legendary',
    xpReward: 2000,
    requirement: { type: 'categories_started', count: 23 }, // Placeholder - would need custom logic
    icon: '💎',
  },
  {
    id: 'secret_early_bird',
    name: 'Early Adopter',
    description: 'Be one of the first 1000 users',
    category: 'global',
    tier: 'gold',
    xpReward: 500,
    requirement: { type: 'total_visited', count: 1 }, // Awarded manually/via backend
    icon: '🐦',
  },
];

// ============================================
// Helper Functions
// ============================================

/**
 * Calculate level from XP using the same formula as the database
 * Level = floor(sqrt(xp / 100)) + 1
 */
export function calculateLevel(xp: number): number {
  return Math.max(1, Math.floor(Math.sqrt(xp / 100)) + 1);
}

/**
 * Calculate XP needed for next level
 */
export function xpForLevel(level: number): number {
  // Level n requires (n-1)^2 * 100 XP
  return Math.pow(level - 1, 2) * 100;
}

/**
 * Calculate XP needed for next level from current XP
 */
export function xpToNextLevel(currentXp: number): { current: number; needed: number; progress: number } {
  const currentLevel = calculateLevel(currentXp);
  const currentLevelXp = xpForLevel(currentLevel);
  const nextLevelXp = xpForLevel(currentLevel + 1);
  const xpIntoLevel = currentXp - currentLevelXp;
  const xpNeededForNext = nextLevelXp - currentLevelXp;

  return {
    current: xpIntoLevel,
    needed: xpNeededForNext,
    progress: (xpIntoLevel / xpNeededForNext) * 100,
  };
}

/**
 * Get stats for a category from selections
 */
export function getCategoryStats(selections: UserSelections, category: Category) {
  const categorySelections = selections[category] || [];
  const activeSelections = categorySelections.filter(s => !s.deleted);
  const visited = activeSelections.filter(s => s.status === 'visited').length;
  const bucketList = activeSelections.filter(s => s.status === 'bucketList').length;
  const total = getCategoryTotals()[category];
  const percentage = total > 0 ? Math.round((visited / total) * 100) : 0;

  return { visited, bucketList, total, percentage };
}

/**
 * Get total visited count across all categories
 */
export function getTotalVisited(selections: UserSelections): number {
  return ALL_CATEGORIES.reduce((total, category) => {
    const categorySelections = selections[category] || [];
    const visited = categorySelections.filter(s => !s.deleted && s.status === 'visited').length;
    return total + visited;
  }, 0);
}

/**
 * Get count of categories with at least one visit
 */
export function getCategoriesStarted(selections: UserSelections): number {
  return ALL_CATEGORIES.filter(category => {
    const categorySelections = selections[category] || [];
    return categorySelections.some(s => !s.deleted && s.status === 'visited');
  }).length;
}

/**
 * Calculate total XP from selections
 */
export function calculateTotalXp(selections: UserSelections): number {
  return ALL_CATEGORIES.reduce((total, category) => {
    const categorySelections = selections[category] || [];
    const visited = categorySelections.filter(s => !s.deleted && s.status === 'visited').length;
    return total + (visited * XP_VALUES[category]);
  }, 0);
}

/**
 * Streak data interface for achievement checking
 */
export interface StreakData {
  currentLoginStreak: number;
  longestLoginStreak: number;
  currentSeasonStreak: number;
  longestSeasonStreak: number;
}

/**
 * Check if an achievement requirement is met
 */
export function isAchievementUnlocked(
  achievement: AchievementDefinition,
  selections: UserSelections,
  currentLevel: number,
  streaks?: StreakData
): boolean {
  const req = achievement.requirement;

  switch (req.type) {
    case 'visited_count': {
      if (achievement.category === 'global') return false; // Invalid for global
      const stats = getCategoryStats(selections, achievement.category as Category);
      return stats.visited >= req.count;
    }

    case 'percentage': {
      if (achievement.category === 'global') return false;
      const stats = getCategoryStats(selections, achievement.category as Category);
      return stats.percentage >= req.percentage;
    }

    case 'total_visited': {
      return getTotalVisited(selections) >= req.count;
    }

    case 'categories_started': {
      return getCategoriesStarted(selections) >= req.count;
    }

    case 'completionist': {
      const stats = getCategoryStats(selections, req.category);
      return stats.visited >= stats.total && stats.total > 0;
    }

    case 'level': {
      return currentLevel >= req.level;
    }

    case 'login_streak': {
      if (!streaks) return false;
      return streaks.longestLoginStreak >= req.count;
    }

    case 'season_streak': {
      if (!streaks) return false;
      return streaks.longestSeasonStreak >= req.count;
    }

    default:
      return false;
  }
}

/**
 * Get progress toward an achievement (0-100)
 */
export function getAchievementProgress(
  achievement: AchievementDefinition,
  selections: UserSelections,
  currentLevel: number,
  streaks?: StreakData
): { current: number; target: number; percentage: number } {
  const req = achievement.requirement;

  switch (req.type) {
    case 'visited_count': {
      if (achievement.category === 'global') return { current: 0, target: req.count, percentage: 0 };
      const stats = getCategoryStats(selections, achievement.category as Category);
      return {
        current: stats.visited,
        target: req.count,
        percentage: Math.min(100, (stats.visited / req.count) * 100),
      };
    }

    case 'percentage': {
      if (achievement.category === 'global') return { current: 0, target: req.percentage, percentage: 0 };
      const stats = getCategoryStats(selections, achievement.category as Category);
      return {
        current: stats.percentage,
        target: req.percentage,
        percentage: Math.min(100, (stats.percentage / req.percentage) * 100),
      };
    }

    case 'total_visited': {
      const total = getTotalVisited(selections);
      return {
        current: total,
        target: req.count,
        percentage: Math.min(100, (total / req.count) * 100),
      };
    }

    case 'categories_started': {
      const started = getCategoriesStarted(selections);
      return {
        current: started,
        target: req.count,
        percentage: Math.min(100, (started / req.count) * 100),
      };
    }

    case 'completionist': {
      const stats = getCategoryStats(selections, req.category);
      return {
        current: stats.visited,
        target: stats.total,
        percentage: stats.total > 0 ? Math.min(100, (stats.visited / stats.total) * 100) : 0,
      };
    }

    case 'level': {
      return {
        current: currentLevel,
        target: req.level,
        percentage: Math.min(100, (currentLevel / req.level) * 100),
      };
    }

    case 'login_streak': {
      const current = streaks?.currentLoginStreak || 0;
      return {
        current,
        target: req.count,
        percentage: Math.min(100, (current / req.count) * 100),
      };
    }

    case 'season_streak': {
      const current = streaks?.currentSeasonStreak || 0;
      return {
        current,
        target: req.count,
        percentage: Math.min(100, (current / req.count) * 100),
      };
    }

    default:
      return { current: 0, target: 0, percentage: 0 };
  }
}

/**
 * Get all achievements that should be unlocked based on current progress
 */
export function getUnlockedAchievements(
  selections: UserSelections,
  alreadyUnlocked: string[],
  streaks?: StreakData
): AchievementDefinition[] {
  const totalXp = calculateTotalXp(selections);
  const currentLevel = calculateLevel(totalXp);

  return ACHIEVEMENTS.filter(achievement => {
    // Skip already unlocked
    if (alreadyUnlocked.includes(achievement.id)) return false;

    return isAchievementUnlocked(achievement, selections, currentLevel, streaks);
  });
}

/**
 * Get achievements grouped by category
 */
export function getAchievementsByCategory(): Map<string, AchievementDefinition[]> {
  const byCategory = new Map<string, AchievementDefinition[]>();

  for (const achievement of ACHIEVEMENTS) {
    const category = achievement.category;
    if (!byCategory.has(category)) {
      byCategory.set(category, []);
    }
    byCategory.get(category)!.push(achievement);
  }

  return byCategory;
}

/**
 * Get tier color for styling
 */
export function getTierColor(tier: AchievementTier): string {
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
 * Get tier label for display
 */
export function getTierLabel(tier: AchievementTier): string {
  return tier.charAt(0).toUpperCase() + tier.slice(1);
}
