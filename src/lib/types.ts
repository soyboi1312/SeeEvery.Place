import { ReactNode } from "react";

export type Category =
  | "countries"
  | "states"
  | "nationalParks"
  | "stateParks"
  | "unesco"
  | "fiveKPeaks"
  | "fourteeners"
  | "museums"
  | "mlbStadiums"
  | "nflStadiums"
  | "nbaStadiums"
  | "nhlStadiums"
  | "soccerStadiums"
  | "f1Tracks"
  | "marathons";

export type Status = "visited" | "bucketList" | "unvisited";

// Subcategory definitions for categories that support filtering (deprecated - now using separate categories)

// Map of categories to their subcategories (empty - subcategories are now handled in CategoryTabs)
export const categorySubcategories: Partial<Record<Category, readonly string[]>> = {};

// Check if a category has subcategories
export const hasSubcategories = (category: Category): boolean => {
  return category in categorySubcategories;
};

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
  mlbStadiums: Selection[];
  nflStadiums: Selection[];
  nbaStadiums: Selection[];
  nhlStadiums: Selection[];
  soccerStadiums: Selection[];
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

export const categoryLabels: Record<Category, string> = {
  countries: "Countries",
  states: "US States",
  nationalParks: "National Parks",
  stateParks: "State Parks",
  unesco: "UNESCO Sites",
  fiveKPeaks: "5000m+ Peaks",
  fourteeners: "US 14ers",
  museums: "Museums",
  mlbStadiums: "MLB",
  nflStadiums: "NFL",
  nbaStadiums: "NBA",
  nhlStadiums: "NHL",
  soccerStadiums: "Soccer",
  f1Tracks: "F1 Tracks",
  marathons: "Marathon Majors",
};

// US Parks is a parent category that contains nationalParks and stateParks
export const usParksSubcategories: Category[] = ["nationalParks", "stateParks"];

export const subcategoryLabels: Record<string, string> = {
  nationalParks: "National Parks",
  stateParks: "State Parks",
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
  mlbStadiums: "⚾",
  nflStadiums: "🏈",
  nbaStadiums: "🏀",
  nhlStadiums: "🏒",
  soccerStadiums: "⚽",
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
  mlbStadiums: [],
  nflStadiums: [],
  nbaStadiums: [],
  nhlStadiums: [],
  soccerStadiums: [],
  f1Tracks: [],
  marathons: [],
};
