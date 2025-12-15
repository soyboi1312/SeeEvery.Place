import { ReactNode } from "react";

// =====================
// SINGLE SOURCE OF TRUTH - Category Schema
// =====================
// All category definitions derive from this schema (DRY + OCP)
// To add a new category: simply add it here, everything else derives automatically
// NOTE: If updating this, also update get_analytics_summary() in supabase/migrations/20241207_analytics_rpc.sql

export const CATEGORY_SCHEMA = {
  countries: { label: "Countries", icon: "🌍", group: "destinations", xp: 25, total: 197 },
  worldCities: { label: "World Cities", icon: "🌆", group: "destinations", xp: 10, total: 115 },
  states: { label: "US States", icon: "🇺🇸", group: "destinations", xp: 15, total: 50 },
  territories: { label: "US Territories", icon: "🏝️", group: "destinations", xp: 20, total: 14 },
  usCities: { label: "US Cities", icon: "🏙️", group: "destinations", xp: 5, total: 75 },
  nationalParks: { label: "National Parks", icon: "🏞️", group: "nature", xp: 30, total: 63 },
  nationalMonuments: { label: "National Monuments", icon: "🗽", group: "nature", xp: 25, total: 138 },
  stateParks: { label: "State Parks", icon: "🌲", group: "nature", xp: 15, total: 305 },
  fiveKPeaks: { label: "5000m+ Peaks", icon: "🏔️", group: "nature", xp: 50, total: 37 },
  fourteeners: { label: "US 14ers", icon: "⛰️", group: "nature", xp: 40, total: 70 },
  museums: { label: "Museums", icon: "🎨", group: "culture", xp: 15, total: 46 },
  mlbStadiums: { label: "MLB Stadiums", icon: "⚾", group: "sports", xp: 20, total: 33 },
  nflStadiums: { label: "NFL Stadiums", icon: "🏈", group: "sports", xp: 20, total: 32 },
  nbaStadiums: { label: "NBA Arenas", icon: "🏀", group: "sports", xp: 20, total: 30 },
  nhlStadiums: { label: "NHL Arenas", icon: "🏒", group: "sports", xp: 20, total: 32 },
  soccerStadiums: { label: "Soccer Stadiums", icon: "⚽", group: "sports", xp: 25, total: 48 },
  euroFootballStadiums: { label: "European Football", icon: "⚽", group: "sports", xp: 20, total: 179 },
  rugbyStadiums: { label: "Rugby Stadiums", icon: "🏉", group: "sports", xp: 25, total: 87 },
  cricketStadiums: { label: "Cricket Grounds", icon: "🏏", group: "sports", xp: 25, total: 75 },
  f1Tracks: { label: "F1 Tracks", icon: "🏎️", group: "sports", xp: 35, total: 34 },
  marathons: { label: "Marathon Majors", icon: "🏃", group: "sports", xp: 100, total: 7 },
  airports: { label: "Airports", icon: "✈️", group: "destinations", xp: 5, total: 58 },
  skiResorts: { label: "Ski Resorts", icon: "⛷️", group: "nature", xp: 25, total: 32 },
  themeParks: { label: "Theme Parks", icon: "🎢", group: "culture", xp: 20, total: 37 },
  surfingReserves: { label: "Surfing Reserves", icon: "🌊", group: "nature", xp: 30, total: 26 },
  weirdAmericana: { label: "Weird Americana", icon: "🗿", group: "culture", xp: 15, total: 56 },
} as const;

// Helper to access category metadata
export const getCategoryMeta = (category: Category) => CATEGORY_SCHEMA[category];

// =====================
// DERIVED TYPES AND CONSTANTS (DRY)
// =====================

// Derive Category type from schema keys
export type Category = keyof typeof CATEGORY_SCHEMA;

// Derive ALL_CATEGORIES array from schema keys
export const ALL_CATEGORIES = Object.keys(CATEGORY_SCHEMA) as Category[];

// Derive categoryLabels from schema
export const categoryLabels = Object.fromEntries(
  Object.entries(CATEGORY_SCHEMA).map(([k, v]) => [k, v.label])
) as Record<Category, string>;

// Derive categoryIcons from schema
export const categoryIcons = Object.fromEntries(
  Object.entries(CATEGORY_SCHEMA).map(([k, v]) => [k, v.icon])
) as Record<Category, ReactNode>;

// =====================
// STATUS AND SELECTION TYPES
// =====================

export type Status = "visited" | "bucketList" | "unvisited";

export interface Selection {
  id: string;
  status: Status;
  /** Timestamp of last update (ms since epoch) for sync conflict resolution */
  updatedAt?: number;
  /** Soft-delete flag for tracking deletions across devices */
  deleted?: boolean;
  /** Date the location was visited (ISO string YYYY-MM-DD) */
  visitedDate?: string;
}

// Derive UserSelections type from Category (each category has Selection[])
export type UserSelections = {
  [K in Category]: Selection[];
};

// Derive emptySelections from schema keys
export const emptySelections: UserSelections = Object.keys(CATEGORY_SCHEMA).reduce(
  (acc, key) => ({ ...acc, [key]: [] }),
  {} as UserSelections
);

// =====================
// CATEGORY GROUPS (For UI Organization)
// =====================

export type CategoryGroup = 'destinations' | 'nature' | 'sports' | 'culture';

export interface GroupConfig {
  label: string;
  icon: string;
  categories: Category[];
}

// Group metadata (labels and icons)
const GROUP_META: Record<CategoryGroup, { label: string; icon: string }> = {
  destinations: { label: 'Destinations', icon: '🌍' },
  nature: { label: 'Nature', icon: '🌲' },
  sports: { label: 'Sports', icon: '🏆' },
  culture: { label: 'Culture', icon: '🏛️' },
};

// Derive categoryGroups from schema (DRY - groups defined in schema, not duplicated)
export const categoryGroups: Record<CategoryGroup, GroupConfig> = (() => {
  const groups: Record<CategoryGroup, Category[]> = {
    destinations: [],
    nature: [],
    sports: [],
    culture: [],
  };

  // Build groups from schema
  for (const [category, config] of Object.entries(CATEGORY_SCHEMA)) {
    const group = config.group as CategoryGroup;
    groups[group].push(category as Category);
  }

  // Combine with metadata
  return Object.fromEntries(
    Object.entries(GROUP_META).map(([group, meta]) => [
      group,
      { ...meta, categories: groups[group as CategoryGroup] },
    ])
  ) as Record<CategoryGroup, GroupConfig>;
})();

// Get group for a category (derived from schema)
export const getGroupForCategory = (category: Category): CategoryGroup => {
  return CATEGORY_SCHEMA[category].group as CategoryGroup;
};

// =====================
// OTHER INTERFACES
// =====================

export interface ShareStats {
  category: Category;
  visited: number;
  total: number;
  percentage: number;
  bucketList: number;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  image?: string;
  selections: UserSelections;
  createdAt: Date;
  updatedAt: Date;
}
