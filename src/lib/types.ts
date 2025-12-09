import { ReactNode } from "react";

// 1. DISTINCT CATEGORIES - Single source of truth
// Export as const array so the type can be derived from it (prevents drift)
// NOTE: If updating this, also update get_analytics_summary() in supabase/migrations/20241207_analytics_rpc.sql
export const ALL_CATEGORIES = [
  "countries",
  "states",
  "territories",
  "nationalParks",
  "nationalMonuments",
  "stateParks",
  "fiveKPeaks",
  "fourteeners",
  "museums",
  "mlbStadiums",
  "nflStadiums",
  "nbaStadiums",
  "nhlStadiums",
  "soccerStadiums",
  "f1Tracks",
  "marathons",
  "airports",
  "skiResorts",
  "themeParks",
  "surfingReserves",
  "weirdAmericana",
] as const;

// Derive type from the array to ensure they never drift apart
export type Category = typeof ALL_CATEGORIES[number];

export type Status = "visited" | "bucketList" | "unvisited";

// 2. META-GROUPS (For UI Organization Only)
export type CategoryGroup = 'destinations' | 'nature' | 'sports' | 'culture';

export interface GroupConfig {
  label: string;
  icon: string;
  categories: Category[];
}

// Define which specific categories belong to which group
export const categoryGroups: Record<CategoryGroup, GroupConfig> = {
  destinations: {
    label: 'Destinations',
    icon: '🌍',
    categories: ['countries', 'states', 'territories', 'airports'],
  },
  nature: {
    label: 'Nature',
    icon: '🌲',
    categories: ['nationalParks', 'nationalMonuments', 'stateParks', 'fiveKPeaks', 'fourteeners', 'skiResorts', 'surfingReserves'],
  },
  sports: {
    label: 'Sports',
    icon: '🏆',
    categories: [
      'mlbStadiums',
      'nflStadiums',
      'nbaStadiums',
      'nhlStadiums',
      'soccerStadiums',
      'f1Tracks',
      'marathons'
    ],
  },
  culture: {
    label: 'Culture',
    icon: '🏛️',
    categories: ['museums', 'themeParks', 'weirdAmericana'],
  },
};

export const getGroupForCategory = (category: Category): CategoryGroup => {
  for (const [group, config] of Object.entries(categoryGroups)) {
    if (config.categories.includes(category)) {
      return group as CategoryGroup;
    }
  }
  return 'destinations';
};

// 3. SELECTIONS (Distinct Keys)
export interface Selection {
  id: string;
  status: Status;
  /** Timestamp of last update (ms since epoch) for sync conflict resolution */
  updatedAt?: number;
  /** Soft-delete flag for tracking deletions across devices */
  deleted?: boolean;
}

export interface UserSelections {
  countries: Selection[];
  states: Selection[];
  territories: Selection[];
  nationalParks: Selection[];
  nationalMonuments: Selection[];
  stateParks: Selection[];
  fiveKPeaks: Selection[];
  fourteeners: Selection[];
  museums: Selection[];
  mlbStadiums: Selection[];
  nflStadiums: Selection[];
  nbaStadiums: Selection[];
  nhlStadiums: Selection[];
  soccerStadiums: Selection[];
  f1Tracks: Selection[];
  marathons: Selection[];
  airports: Selection[];
  skiResorts: Selection[];
  themeParks: Selection[];
  surfingReserves: Selection[];
  weirdAmericana: Selection[];
}

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

// 4. LABELS & ICONS
export const categoryLabels: Record<Category, string> = {
  countries: "Countries",
  states: "US States",
  territories: "US Territories",
  nationalParks: "National Parks",
  nationalMonuments: "National Monuments",
  stateParks: "State Parks",
  fiveKPeaks: "5000m+ Peaks",
  fourteeners: "US 14ers",
  museums: "Museums",
  mlbStadiums: "MLB Stadiums",
  nflStadiums: "NFL Stadiums",
  nbaStadiums: "NBA Arenas",
  nhlStadiums: "NHL Arenas",
  soccerStadiums: "Soccer Stadiums",
  f1Tracks: "F1 Tracks",
  marathons: "Marathon Majors",
  airports: "Airports",
  skiResorts: "Ski Resorts",
  themeParks: "Theme Parks",
  surfingReserves: "Surfing Reserves",
  weirdAmericana: "Weird Americana",
};

export const categoryIcons: Record<Category, ReactNode> = {
  countries: "🌍",
  states: "🇺🇸",
  territories: "🏝️",
  nationalParks: "🏞️",
  nationalMonuments: "🗽",
  stateParks: "🌲",
  fiveKPeaks: "🏔️",
  fourteeners: "⛰️",
  museums: "🎨",
  mlbStadiums: "⚾",
  nflStadiums: "🏈",
  nbaStadiums: "🏀",
  nhlStadiums: "🏒",
  soccerStadiums: "⚽",
  f1Tracks: "🏎️",
  marathons: "🏃",
  airports: "✈️",
  skiResorts: "⛷️",
  themeParks: "🎢",
  surfingReserves: "🌊",
  weirdAmericana: "🗿",
};

export const emptySelections: UserSelections = {
  countries: [],
  states: [],
  territories: [],
  nationalParks: [],
  nationalMonuments: [],
  stateParks: [],
  fiveKPeaks: [],
  fourteeners: [],
  museums: [],
  mlbStadiums: [],
  nflStadiums: [],
  nbaStadiums: [],
  nhlStadiums: [],
  soccerStadiums: [],
  f1Tracks: [],
  marathons: [],
  airports: [],
  skiResorts: [],
  themeParks: [],
  surfingReserves: [],
  weirdAmericana: [],
};
