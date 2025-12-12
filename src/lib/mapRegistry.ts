/**
 * Map Registry
 * Category to data source mapping following OCP (Open/Closed Principle)
 * Extend by adding to registry objects, not by modifying lookup logic
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
import { getMlbStadiums, getNflStadiums, getNbaStadiums, getNhlStadiums, getSoccerStadiums, Stadium } from '@/data/stadiums';

// =====================
// Static Maps Registry
// =====================

// Create static lookup maps once at module load
const nationalParksMap = createLookupMap(nationalParks);
const nationalMonumentsMap = createLookupMap(nationalMonuments);
const stateParksMap = createLookupMap(stateParks);
const museumsMap = createLookupMap(museums);
const f1TracksMap = createLookupMap(f1Tracks);
const marathonsMap = createLookupMap(marathons);
const airportsMap = createLookupMap(airports);
const skiResortsMap = createLookupMap(skiResorts);
const themeParksMap = createLookupMap(themeParks);
const surfingReservesMap = createLookupMap(surfingReserves);
const weirdAmericanaMap = createLookupMap(weirdAmericana);
const usCitiesMap = createLookupMap(usCities);
const worldCitiesMap = createLookupMap(worldCities);

// Territories use 'code' as ID, so we need a custom map
type TerritoryCoordItem = { id: string; lat: number; lng: number; name: string };
const territoriesMap = new Map<string, TerritoryCoordItem>(
  usTerritories.map(t => [t.code, { id: t.code, lat: t.lat, lng: t.lng, name: t.name }])
);

/**
 * Static maps registry - categories mapped to their pre-built lookup maps
 * Following OCP: add new static categories here without modifying getLookupMapForCategory
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const staticMaps: Partial<Record<Category, Map<string, any>>> = {
  nationalParks: nationalParksMap,
  nationalMonuments: nationalMonumentsMap,
  stateParks: stateParksMap,
  museums: museumsMap,
  f1Tracks: f1TracksMap,
  marathons: marathonsMap,
  airports: airportsMap,
  skiResorts: skiResortsMap,
  themeParks: themeParksMap,
  surfingReserves: surfingReservesMap,
  weirdAmericana: weirdAmericanaMap,
  territories: territoriesMap,
  usCities: usCitiesMap,
  worldCities: worldCitiesMap,
};

// =====================
// Lazy Maps Registry
// =====================

/**
 * Lazy map generators - functions that generate data on first access
 * These are called once and cached to avoid regenerating large datasets
 */
const lazyMapGenerators: Partial<Record<Category, () => CoordItem[]>> = {
  fiveKPeaks: get5000mPeaks as () => CoordItem[],
  fourteeners: getUS14ers as () => CoordItem[],
  mlbStadiums: getMlbStadiums as () => CoordItem[],
  nflStadiums: getNflStadiums as () => CoordItem[],
  nbaStadiums: getNbaStadiums as () => CoordItem[],
  nhlStadiums: getNhlStadiums as () => CoordItem[],
  soccerStadiums: getSoccerStadiums as () => CoordItem[],
};

/**
 * Cache for lazy-initialized maps
 * Maps are created on first access and cached for subsequent lookups
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const lazyMapCache: Partial<Record<Category, Map<string, any>>> = {};

// =====================
// Public API
// =====================

/**
 * Get the lookup map for a category
 * Uses registry pattern instead of switch statement (OCP)
 *
 * @param category - The category to get the lookup map for
 * @returns The lookup map or null if category not found
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getLookupMapForCategory(category: Category): Map<string, any> | null {
  // Check static maps first (O(1) object property lookup)
  if (category in staticMaps) {
    return staticMaps[category]!;
  }

  // Check cache for lazy maps
  if (lazyMapCache[category]) {
    return lazyMapCache[category]!;
  }

  // Initialize lazy map if generator exists
  const generator = lazyMapGenerators[category];
  if (generator) {
    const map = createLookupMap(generator());
    lazyMapCache[category] = map;
    return map;
  }

  return null;
}

/**
 * Check if a category has a registered lookup map
 */
export function hasLookupMap(category: Category): boolean {
  return category in staticMaps || category in lazyMapGenerators;
}

// Re-export types for external use
export type { Mountain, Stadium };
