/**
 * Map Registry
 * Category to data source mapping following OCP (Open/Closed Principle)
 * All maps use lazy loading - data is only loaded when first requested
 */

import { Category } from '@/lib/types';
import { createLookupMap, CoordItem } from './mapHelpers';

// Import static data
import { nationalParks } from '@/data/nationalParks';
import { nationalMonuments } from '@/data/nationalMonuments';
import { stateParks } from '@/data/stateParks';
import { museums } from '@/data/museums';
import { f1Tracks } from '@/data/f1Tracks';
import { marathons } from '@/data/marathons';
import { airports } from '@/data/airports';
import { skiResorts } from '@/data/skiResorts';
import { themeParks } from '@/data/themeParks';
import { surfingReserves } from '@/data/surfingReserves';
import { weirdAmericana } from '@/data/weirdAmericana';
import { usTerritories } from '@/data/usTerritories';
import { usCities } from '@/data/usCities';
import { worldCities } from '@/data/worldCities';

// Import lazy-loaded data generators
import { get5000mPeaks, getUS14ers, Mountain } from '@/data/mountains';
import { getMlbStadiums, getNflStadiums, getNbaStadiums, getNhlStadiums, getSoccerStadiums, getEuroFootballStadiums, getRugbyStadiums, getCricketStadiums, Stadium } from '@/data/stadiums';

// =====================
// Unified Registry (OCP + Performance)
// =====================

// All entries are generator functions for lazy evaluation
type DataGenerator = () => CoordItem[];

// Helper to wrap static data into a generator (defers array reference)
const wrapStatic = (getData: () => CoordItem[]): DataGenerator => getData;

// Unified registry - all categories use generator functions
// Maps are only created when first accessed (lazy loading)
const registry: Partial<Record<Category, DataGenerator>> = {
  // Static data wrapped in getters for consistent lazy access pattern
  nationalParks: wrapStatic(() => nationalParks),
  nationalMonuments: wrapStatic(() => nationalMonuments),
  stateParks: wrapStatic(() => stateParks),
  museums: wrapStatic(() => museums),
  f1Tracks: wrapStatic(() => f1Tracks),
  marathons: wrapStatic(() => marathons),
  airports: wrapStatic(() => airports),
  skiResorts: wrapStatic(() => skiResorts),
  themeParks: wrapStatic(() => themeParks),
  surfingReserves: wrapStatic(() => surfingReserves),
  weirdAmericana: wrapStatic(() => weirdAmericana),
  usCities: wrapStatic(() => usCities),
  worldCities: wrapStatic(() => worldCities),

  // Custom transform for territories (uses 'code' as ID)
  territories: () => usTerritories.map(t => ({ id: t.code, lat: t.lat, lng: t.lng, name: t.name })),

  // Dynamic data generators (already functions)
  fiveKPeaks: get5000mPeaks as DataGenerator,
  fourteeners: getUS14ers as DataGenerator,
  mlbStadiums: getMlbStadiums as DataGenerator,
  nflStadiums: getNflStadiums as DataGenerator,
  nbaStadiums: getNbaStadiums as DataGenerator,
  nhlStadiums: getNhlStadiums as DataGenerator,
  soccerStadiums: getSoccerStadiums as DataGenerator,
  euroFootballStadiums: getEuroFootballStadiums as DataGenerator,
  rugbyStadiums: getRugbyStadiums as DataGenerator,
  cricketStadiums: getCricketStadiums as DataGenerator,
};

// Single cache for all lookup maps
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapCache = new Map<Category, Map<string, any>>();

// =====================
// Public API
// =====================

/**
 * Get the lookup map for a category
 * Uses registry pattern instead of switch statement (OCP)
 * Maps are created lazily on first access and cached
 *
 * @param category - The category to get the lookup map for
 * @returns The lookup map or null if category not found
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getLookupMapForCategory(category: Category): Map<string, any> | null {
  // Check cache first
  if (mapCache.has(category)) {
    return mapCache.get(category)!;
  }

  // Generate and cache if generator exists
  const generator = registry[category];
  if (generator) {
    const map = createLookupMap(generator());
    mapCache.set(category, map);
    return map;
  }

  return null;
}

/**
 * Check if a category has a registered lookup map
 */
export function hasLookupMap(category: Category): boolean {
  return category in registry;
}

// Re-export types for external use
export type { Mountain, Stadium };
