import { ReactNode } from "react";

// 1. DISTINCT CATEGORIES (Restored)
export type Category =
  | "countries"
  | "states"
  | "nationalParks"
  | "stateParks"
  | "fiveKPeaks"
  | "fourteeners"
  | "museums"
  | "mlbStadiums"
  | "nflStadiums"
  | "nbaStadiums"
  | "nhlStadiums"
  | "soccerStadiums"
  | "f1Tracks"
  | "marathons"
  | "airports"
  | "skiResorts"
  | "themeParks"
  | "surfingReserves"
  | "weirdAmericana";

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
    categories: ['countries', 'states', 'airports'],
  },
  nature: {
    label: 'Nature',
    icon: '🌲',
    categories: ['nationalParks', 'stateParks', 'fiveKPeaks', 'fourteeners', 'skiResorts', 'surfingReserves'],
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
}

export interface UserSelections {
  countries: Selection[];
  states: Selection[];
  nationalParks: Selection[];
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
  nationalParks: "National Parks",
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
  nationalParks: "🏞️",
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
  nationalParks: [],
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
