import { ReactNode } from "react";

// =====================
// SINGLE SOURCE OF TRUTH - Category Schema
// =====================
// All category definitions derive from this schema (DRY + OCP)
// To add a new category: simply add it here, everything else derives automatically
// NOTE: If updating this, also update get_analytics_summary() in supabase/migrations/20241207_analytics_rpc.sql

// Map configuration types
export type MapType = 'region' | 'marker';
export type MapProjection = 'world' | 'us';

export const CATEGORY_SCHEMA = {
  // Region maps (colored polygons)
  countries: { label: "Countries", icon: "🌍", group: "destinations", xp: 25, total: 200, mapType: 'region' as const, projection: 'world' as const, drillDown: false },
  states: { label: "US States", icon: "🇺🇸", group: "destinations", xp: 15, total: 50, mapType: 'region' as const, projection: 'us' as const, drillDown: false },

  // US marker maps (Albers USA projection)
  usCities: { label: "US Cities", icon: "🏙️", group: "destinations", xp: 5, total: 86, mapType: 'marker' as const, projection: 'us' as const, drillDown: false },
  nationalParks: { label: "National Parks", icon: "🏞️", group: "nature", xp: 30, total: 64, mapType: 'marker' as const, projection: 'us' as const, drillDown: true },
  nationalMonuments: { label: "National Monuments", icon: "🗽", group: "nature", xp: 25, total: 139, mapType: 'marker' as const, projection: 'us' as const, drillDown: true },
  stateParks: { label: "State Parks", icon: "🌲", group: "nature", xp: 15, total: 306, mapType: 'marker' as const, projection: 'us' as const, drillDown: true },
  fourteeners: { label: "US 14ers", icon: "⛰️", group: "nature", xp: 40, total: 70, mapType: 'marker' as const, projection: 'us' as const, drillDown: false },
  weirdAmericana: { label: "Weird Americana", icon: "🗿", group: "culture", xp: 15, total: 56, mapType: 'marker' as const, projection: 'us' as const, drillDown: true },

  // World marker maps (Natural Earth projection)
  worldCities: { label: "World Cities", icon: "🌆", group: "destinations", xp: 10, total: 243, mapType: 'marker' as const, projection: 'world' as const, drillDown: true },
  territories: { label: "US Territories", icon: "🏝️", group: "destinations", xp: 20, total: 15, mapType: 'marker' as const, projection: 'world' as const, drillDown: false },
  fiveKPeaks: { label: "5000m+ Peaks", icon: "🏔️", group: "nature", xp: 50, total: 37, mapType: 'marker' as const, projection: 'world' as const, drillDown: false },
  museums: { label: "Museums", icon: "🎨", group: "culture", xp: 15, total: 65, mapType: 'marker' as const, projection: 'world' as const, drillDown: false },
  mlbStadiums: { label: "MLB Stadiums", icon: "⚾", group: "sports", xp: 20, total: 30, mapType: 'marker' as const, projection: 'world' as const, drillDown: false },
  nflStadiums: { label: "NFL Stadiums", icon: "🏈", group: "sports", xp: 20, total: 32, mapType: 'marker' as const, projection: 'world' as const, drillDown: false },
  nbaStadiums: { label: "NBA Arenas", icon: "🏀", group: "sports", xp: 20, total: 30, mapType: 'marker' as const, projection: 'world' as const, drillDown: false },
  nhlStadiums: { label: "NHL Arenas", icon: "🏒", group: "sports", xp: 20, total: 32, mapType: 'marker' as const, projection: 'world' as const, drillDown: false },
  soccerStadiums: { label: "Soccer Stadiums", icon: "⚽", group: "sports", xp: 25, total: 48, mapType: 'marker' as const, projection: 'world' as const, drillDown: false },
  euroFootballStadiums: { label: "European Football", icon: "⚽", group: "sports", xp: 20, total: 179, mapType: 'marker' as const, projection: 'world' as const, drillDown: false },
  rugbyStadiums: { label: "Rugby Stadiums", icon: "🏉", group: "sports", xp: 25, total: 87, mapType: 'marker' as const, projection: 'world' as const, drillDown: false },
  cricketStadiums: { label: "Cricket Grounds", icon: "🏏", group: "sports", xp: 25, total: 75, mapType: 'marker' as const, projection: 'world' as const, drillDown: false },
  f1Tracks: { label: "F1 Tracks", icon: "🏎️", group: "sports", xp: 35, total: 35, mapType: 'marker' as const, projection: 'world' as const, drillDown: false },
  marathons: { label: "Marathon Majors", icon: "🏃", group: "sports", xp: 100, total: 8, mapType: 'marker' as const, projection: 'world' as const, drillDown: false },
  airports: { label: "Airports", icon: "✈️", group: "destinations", xp: 5, total: 59, mapType: 'marker' as const, projection: 'world' as const, drillDown: false },
  skiResorts: { label: "Ski Resorts", icon: "⛷️", group: "nature", xp: 25, total: 38, mapType: 'marker' as const, projection: 'world' as const, drillDown: false },
  themeParks: { label: "Theme Parks", icon: "🎢", group: "culture", xp: 20, total: 60, mapType: 'marker' as const, projection: 'world' as const, drillDown: false },
  surfingReserves: { label: "Surfing Reserves", icon: "🌊", group: "nature", xp: 30, total: 27, mapType: 'marker' as const, projection: 'world' as const, drillDown: false },
  countryHighPoints: { label: "Country High Points", icon: "🏔️", group: "nature", xp: 35, total: 199, mapType: 'marker' as const, projection: 'world' as const, drillDown: false },
} as const;

// Derived sets for map rendering (used by MapVisualization)
export const US_MARKER_CATEGORIES = new Set(
  (Object.entries(CATEGORY_SCHEMA) as [Category, typeof CATEGORY_SCHEMA[Category]][])
    .filter(([, config]) => config.mapType === 'marker' && config.projection === 'us')
    .map(([key]) => key)
);

export const DRILL_DOWN_CATEGORIES = new Set(
  (Object.entries(CATEGORY_SCHEMA) as [Category, typeof CATEGORY_SCHEMA[Category]][])
    .filter(([, config]) => config.drillDown)
    .map(([key]) => key)
);

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
  /** Private notes about the location (max 280 chars) */
  notes?: string;
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

// =====================
// ITINERARY (TRIPS) TYPES
// =====================

export type ItineraryRole = 'owner' | 'editor' | 'viewer' | 'public';

export interface Itinerary {
  id: string;
  owner_id: string;
  owner_username?: string;
  owner_avatar_url?: string;
  title: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  is_public: boolean;
  cover_image_url?: string;
  created_at: string;
  updated_at: string;
  item_count?: number;
  collaborator_count?: number;
  user_role?: ItineraryRole;
}

export interface ItineraryItem {
  id: string;
  itinerary_id: string;
  category: Category;
  place_id: string;
  place_name: string;
  notes?: string;
  sort_order: number;
  day_number?: number;
  added_by?: string;
  added_by_username?: string;
  created_at: string;
}

export interface ItineraryCollaborator {
  user_id: string;
  username: string;
  avatar_url?: string;
  full_name?: string;
  role: 'editor' | 'viewer';
  created_at: string;
}

export interface CreateItineraryInput {
  title: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  is_public?: boolean;
}

export interface UpdateItineraryInput {
  title?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  is_public?: boolean;
  cover_image_url?: string;
}

export interface AddItineraryItemInput {
  itinerary_id: string;
  category: Category;
  place_id: string;
  place_name: string;
  notes?: string;
  sort_order?: number;
  day_number?: number;
}

export interface UpdateItineraryItemInput {
  notes?: string;
  sort_order?: number;
  day_number?: number;
}
