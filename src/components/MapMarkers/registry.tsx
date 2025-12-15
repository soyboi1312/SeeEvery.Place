/**
 * Marker Registry - Maps categories to marker components
 * Following Open/Closed Principle: extend by adding to registry, not modifying map components
 */
import React, { ComponentType } from 'react';
import {
  SportMarker,
  SneakerMarker,
  MountainMarker,
  F1CarMarker,
  FlagMarker,
  AirplaneMarker,
  ParkMarker,
  MuseumMarker,
  SkiMarker,
  ThemeParkMarker,
  SurfingMarker,
  WeirdMarker,
  MarkerSize,
} from '@/components/MapMarkers';
import { Category } from '@/lib/types';

// Common props for all marker components
export interface MarkerProps {
  fillColor: string;
  size: MarkerSize;
}

// Registry mapping categories to their marker components
export const CATEGORY_MARKER_MAP: Partial<Record<Category, ComponentType<MarkerProps>>> = {
  // US-only markers
  fourteeners: MountainMarker,
  nationalParks: ParkMarker,
  nationalMonuments: ParkMarker,
  stateParks: ParkMarker,
  weirdAmericana: WeirdMarker,

  // World markers
  marathons: SneakerMarker,
  fiveKPeaks: MountainMarker,
  f1Tracks: F1CarMarker,
  airports: AirplaneMarker,
  museums: MuseumMarker,
  skiResorts: SkiMarker,
  themeParks: ThemeParkMarker,
  surfingReserves: SurfingMarker,
  territories: FlagMarker,
};

// Sport types for stadium markers
export const SPORT_TYPES: Record<string, string> = {
  mlbStadiums: 'Baseball',
  nflStadiums: 'American Football',
  nbaStadiums: 'Basketball',
  nhlStadiums: 'Hockey',
  soccerStadiums: 'Football',
  euroFootballStadiums: 'Football',
  rugbyStadiums: 'Rugby',
  cricketStadiums: 'Cricket',
};

// Check if category is a stadium type
export function isStadiumCategory(category: Category): boolean {
  return category in SPORT_TYPES;
}

// Get the marker component for a category
export function getMarkerComponent(category: Category): ComponentType<MarkerProps> {
  return CATEGORY_MARKER_MAP[category] || FlagMarker;
}

// Get sport type for stadium categories
export function getSportType(category: Category): string | undefined {
  return SPORT_TYPES[category];
}

// Render the appropriate marker for a category
// This handles both regular markers and sport markers
export function renderCategoryMarker(
  category: Category,
  fillColor: string,
  size: MarkerSize,
  sport?: string
): React.ReactElement {
  // Stadium categories use SportMarker with sport type
  if (isStadiumCategory(category)) {
    return <SportMarker sport={sport || getSportType(category)} fillColor={fillColor} size={size} />;
  }

  // Regular categories use their mapped component
  const MarkerComponent = getMarkerComponent(category);
  return <MarkerComponent fillColor={fillColor} size={size} />;
}
