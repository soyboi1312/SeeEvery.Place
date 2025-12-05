import { ReactNode } from "react";

// 1. SIMPLIFIED CATEGORIES (Merged Stadiums)
export type Category =
  | "countries"
  | "states"
  | "nationalParks"
  | "stateParks"
  | "unesco"
  | "fiveKPeaks"
  | "fourteeners"
  | "museums"
  | "stadiums" // Merged Category
  | "f1Tracks"
  | "marathons";

export type Status = "visited" | "bucketList" | "unvisited";

// 2. NEW GROUPING SYSTEM
export type CategoryGroup = 'destinations' | 'nature' | 'sports' | 'culture';

export interface GroupConfig {
  label: string;
  icon: string;
  categories: Category[];
}

export const categoryGroups: Record<CategoryGroup, GroupConfig> = {
  destinations: {
    label: 'Destinations',
    icon: '🌍',
    categories: ['countries', 'states'],
  },
  nature: {
    label: 'Nature',
    icon: '🌲',
    categories: ['nationalParks', 'stateParks', 'fiveKPeaks', 'fourteeners'],
  },
  sports: {
    label: 'Sports',
    icon: '🏆',
    categories: ['stadiums', 'f1Tracks', 'marathons'],
  },
  culture: {
    label: 'Culture',
    icon: '🏛️',
    categories: ['unesco', 'museums'],
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

// 3. UPDATED SELECTIONS INTERFACE
export interface Selection {
  id: string;
  status: Status;
}

export interface UserSelections {
  countries: Selection[];
  states: Selection[];
  nationalParks: Selection[];
  stateParks: Selection[];
  unesco: Selection[];
  fiveKPeaks: Selection[];
  fourteeners: Selection[];
  museums: Selection[];
  stadiums: Selection[]; // Merged selections
  f1Tracks: Selection[];
  marathons: Selection[];
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

// 4. UPDATED LABELS & ICONS
export const categoryLabels: Record<Category, string> = {
  countries: "Countries",
  states: "US States",
  nationalParks: "National Parks",
  stateParks: "State Parks",
  unesco: "UNESCO Sites",
  fiveKPeaks: "5000m+ Peaks",
  fourteeners: "US 14ers",
  museums: "Museums",
  stadiums: "Stadiums", // Generic Label
  f1Tracks: "F1 Tracks",
  marathons: "Marathon Majors",
};

export const categoryIcons: Record<Category, ReactNode> = {
  countries: "🌍",
  states: "🇺🇸",
  nationalParks: "🏞️",
  stateParks: "🌲",
  unesco: "🏛️",
  fiveKPeaks: "🏔️",
  fourteeners: "⛰️",
  museums: "🎨",
  stadiums: "🏟️", // Generic Icon
  f1Tracks: "🏎️",
  marathons: "🏃",
};

export const emptySelections: UserSelections = {
  countries: [],
  states: [],
  nationalParks: [],
  stateParks: [],
  unesco: [],
  fiveKPeaks: [],
  fourteeners: [],
  museums: [],
  stadiums: [],
  f1Tracks: [],
  marathons: [],
};

// 5. STADIUM FILTER TYPES
export type StadiumFilter = 'ALL' | 'MLB' | 'NFL' | 'NBA' | 'NHL' | 'Soccer' | 'Cricket' | 'Rugby' | 'Tennis';
