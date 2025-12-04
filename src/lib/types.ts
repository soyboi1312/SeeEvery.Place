import { ReactNode } from "react";

export type Category =
  | "countries"
  | "states"
  | "nationalParks"
  | "stateParks"
  | "unesco"
  | "mountains"
  | "museums"
  | "stadiums"
  | "marathons";

export type Status = "visited" | "bucketList" | "unvisited";

// Subcategory definitions for categories that support filtering
export type StadiumSubcategory = "All" | "Football" | "American Football" | "Baseball" | "Basketball" | "Hockey" | "Cricket" | "Rugby" | "Tennis" | "Motorsport";
export type ParkSubcategory = "All" | "National Park" | "State Park";
export type MountainSubcategory = "All" | "5000m+" | "US 14ers";

// Map of categories to their subcategories
export const categorySubcategories: Partial<Record<Category, readonly string[]>> = {
  stadiums: ["All", "Football", "American Football", "Baseball", "Basketball", "Hockey", "Cricket", "Rugby", "Tennis", "Motorsport"] as const,
  mountains: ["All", "5000m+", "US 14ers"] as const,
};

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
  mountains: Selection[];
  museums: Selection[];
  stadiums: Selection[];
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
  mountains: "Peaks",
  museums: "Museums",
  stadiums: "Stadiums",
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
  mountains: "🏔️",
  museums: "🎨",
  stadiums: "🏟️",
  marathons: "🏃",
};

export const emptySelections: UserSelections = {
  countries: [],
  states: [],
  nationalParks: [],
  stateParks: [],
  unesco: [],
  mountains: [],
  museums: [],
  stadiums: [],
  marathons: [],
};
