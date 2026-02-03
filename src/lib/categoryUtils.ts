import { Category, CATEGORY_SCHEMA } from '@/lib/types';
import type { Country } from '@/data/countries';
import type { USState } from '@/data/usStates';
import type { USTerritory } from '@/data/usTerritories';
import type { NationalPark } from '@/data/nationalParks';
import type { NationalMonument } from '@/data/nationalMonuments';
import type { StatePark } from '@/data/stateParks';
import type { Mountain } from '@/data/mountains';
import type { Museum } from '@/data/museums';
import type { Stadium } from '@/data/stadiums';
import type { F1Track } from '@/data/f1Tracks';
import type { Marathon } from '@/data/marathons';
import type { Airport } from '@/data/airports';
import type { SkiResort } from '@/data/skiResorts';
import type { ThemePark } from '@/data/themeParks';
import type { SurfingReserve } from '@/data/surfingReserves';
import type { WeirdAmericana } from '@/data/weirdAmericana';
import type { USCity } from '@/data/usCities';
import type { WorldCity } from '@/data/worldCities';
import type { CountryHighPoint } from '@/data/countryHighPoints';
import type { UNESCOSite } from '@/data/unescoSites';

// Union type for all category data items
// Exported for type-safe usage in map data hooks
export type CategoryDataItem =
  | Country
  | USState
  | USTerritory
  | USCity
  | WorldCity
  | NationalPark
  | NationalMonument
  | StatePark
  | Mountain
  | Museum
  | Stadium
  | F1Track
  | Marathon
  | Airport
  | SkiResort
  | ThemePark
  | SurfingReserve
  | WeirdAmericana
  | CountryHighPoint
  | UNESCOSite;

// Common country abbreviation aliases that differ from ISO codes
export const countryAliases: Record<string, string[]> = {
  'GB': ['UK', 'Britain', 'England'],
  'US': ['USA', 'America'],
  'AE': ['UAE'],
  'KR': ['ROK'],
  'KP': ['DPRK'],
  'RU': ['Russia'],
  'CZ': ['Czech'],
  'CD': ['DRC'],
  'CF': ['CAR'],
  'BA': ['Bosnia'],
  'NZ': ['Kiwi'],
  'ZA': ['RSA'],
  'SA': ['KSA'],
  'PH': ['PHL'],
  'VN': ['Nam'],
};

// Common US state abbreviation aliases
export const stateAliases: Record<string, string[]> = {
  'DC': ['Washington DC', 'District of Columbia'],
};

// Category item type
export interface CategoryItem {
  id: string;
  name: string;
  group: string;
  code?: string;
  aliases?: string[];
  subcategory?: string;
  unescoId?: number;
}

// Cache for loaded data to avoid re-importing (moved up for getCategoryTotal)
const dataCache: Partial<Record<Category, CategoryDataItem[]>> = {};

/**
 * Check if we're running in the browser (client-side).
 * Used to skip fetch() during SSG build where there's no server to fetch from.
 */
const isBrowser = typeof window !== 'undefined';

/**
 * Fetch JSON data from the public data directory.
 * Used for large datasets to avoid bundling in JavaScript.
 * Returns null if the file doesn't exist, fetch fails, or we're on the server.
 *
 * OPTIMIZATION: Using fetch() instead of dynamic imports moves data from
 * the JavaScript bundle to a network request that can be:
 * - Cached by the service worker (/data/*.json rule in next.config.mjs)
 * - Loaded in parallel with other resources
 * - Smaller in size (JSON vs JS module overhead)
 *
 * NOTE: Only works client-side. During SSG/SSR, returns null to use fallback.
 */
async function fetchJsonData<T>(filename: string): Promise<T | null> {
  // Skip fetch during SSG build - there's no server to fetch from
  if (!isBrowser) return null;

  try {
    const response = await fetch(`/data/categories/${filename}`);
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

/**
 * Try to load data from JSON first (for better caching), fall back to dynamic import.
 * This allows gradual migration to JSON files without breaking existing code.
 *
 * Client-side: Tries JSON fetch first for service worker caching benefits.
 * Server-side (SSG): Uses dynamic import directly to avoid fetch timeout issues.
 */
async function loadWithJsonFallback<T>(
  jsonFile: string,
  fallbackLoader: () => Promise<T[]>
): Promise<T[]> {
  // On client, try JSON fetch first for caching benefits
  if (isBrowser) {
    const jsonData = await fetchJsonData<T[]>(jsonFile);
    if (jsonData) return jsonData;
  }
  // Fall back to dynamic import (always used server-side)
  return fallbackLoader();
}

// Dynamic getter that uses cached data when available, falls back to schema values
export function getCategoryTotal(category: Category): number {
  const cachedData = dataCache[category];
  if (cachedData) {
    return cachedData.length;
  }
  // Use CATEGORY_SCHEMA as single source of truth for static totals
  return CATEGORY_SCHEMA[category].total;
}

// For backwards compatibility - use getCategoryTotal() for new code
// Proxy dynamically resolves totals from cache or schema
export const categoryTotals: Record<Category, number> = new Proxy(
  {} as Record<Category, number>,
  {
    get(_, prop: string) {
      if (prop in CATEGORY_SCHEMA) {
        return getCategoryTotal(prop as Category);
      }
      return 0;
    },
    // Required for Object.keys(), Object.entries(), etc.
    ownKeys() {
      return Object.keys(CATEGORY_SCHEMA);
    },
    getOwnPropertyDescriptor(_, prop: string) {
      if (prop in CATEGORY_SCHEMA) {
        return { enumerable: true, configurable: true, value: getCategoryTotal(prop as Category) };
      }
      return undefined;
    },
  }
);

// Category display titles (order matches CATEGORY_SCHEMA)
export const categoryTitles: Record<Category, string> = {
  countries: 'Countries of the World',
  worldCities: 'Major World Cities',
  states: 'US States',
  territories: 'US Territories & Islands',
  usCities: 'Major US Cities',
  nationalParks: 'National Parks',
  nationalMonuments: 'National Monuments',
  stateParks: 'State Parks',
  fiveKPeaks: '5000m+ Mountain Peaks',
  fourteeners: 'US 14ers (14,000+ ft)',
  museums: 'Famous Museums',
  mlbStadiums: 'MLB Stadiums',
  nflStadiums: 'NFL Stadiums',
  nbaStadiums: 'NBA Arenas',
  nhlStadiums: 'NHL Arenas',
  soccerStadiums: 'Soccer Stadiums',
  euroFootballStadiums: 'European Football Stadiums',
  rugbyStadiums: 'Rugby Stadiums',
  cricketStadiums: 'Cricket Grounds',
  f1Tracks: 'Formula 1 Race Tracks',
  marathons: 'World Marathon Majors',
  airports: 'Major World Airports',
  skiResorts: 'World Ski Resorts',
  themeParks: 'Theme Parks & Attractions',
  surfingReserves: 'World Surfing Reserves',
  weirdAmericana: 'Quirky Roadside Attractions',
  countryHighPoints: 'Highest Points by Country',
  unescoSites: 'UNESCO World Heritage Sites',
};

// Transform functions receive category-specific data at runtime via lookup.
// Each transform handles properties specific to its category type.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TransformFn = (item: any) => CategoryItem;

// Transform functions for each category (order matches CATEGORY_SCHEMA)
const transforms: Record<Category, TransformFn> = {
  countries: (c) => ({
    id: c.code,
    name: c.name,
    group: c.continent,
    code: c.code,
    aliases: countryAliases[c.code] || [],
  }),
  worldCities: (c) => ({
    id: c.id,
    name: `${c.name}, ${c.country}`,
    group: c.continent,
  }),
  states: (s) => ({
    id: s.code,
    name: s.name,
    group: s.region,
    code: s.code,
    aliases: stateAliases[s.code] || [],
  }),
  territories: (t) => ({
    id: t.code,
    name: t.name,
    group: t.region,
    code: t.code,
  }),
  usCities: (c) => ({
    id: c.id,
    name: `${c.name}, ${c.stateCode}`,
    group: c.region,
  }),
  nationalParks: (p) => ({
    id: p.id,
    name: p.name,
    group: p.region,
    subcategory: p.type,
  }),
  nationalMonuments: (m) => ({
    id: m.id,
    name: `${m.name} - ${m.state}`,
    group: m.region,
  }),
  stateParks: (p) => ({
    id: p.id,
    name: `${p.name} - ${p.state}`,
    group: p.region,
  }),
  fiveKPeaks: (m) => ({
    id: m.id,
    name: `${m.name} (${m.elevation.toLocaleString()}m)`,
    group: m.range,
  }),
  fourteeners: (m) => ({
    id: m.id,
    name: `${m.name} (${m.elevation.toLocaleString()}m)`,
    group: m.range,
  }),
  museums: (m) => ({
    id: m.id,
    name: `${m.name} - ${m.city}`,
    group: m.country,
  }),
  mlbStadiums: (s) => ({
    id: s.id,
    name: `${s.name} - ${s.city}`,
    group: s.team || s.city,
  }),
  nflStadiums: (s) => ({
    id: s.id,
    name: `${s.name} - ${s.city}`,
    group: s.team || s.city,
  }),
  nbaStadiums: (s) => ({
    id: s.id,
    name: `${s.name} - ${s.city}`,
    group: s.team || s.city,
  }),
  nhlStadiums: (s) => ({
    id: s.id,
    name: `${s.name} - ${s.city}`,
    group: s.team || s.city,
  }),
  soccerStadiums: (s) => ({
    id: s.id,
    name: `${s.name} - ${s.city}`,
    group: s.country,
  }),
  euroFootballStadiums: (s) => ({
    id: s.id,
    name: `${s.name} - ${s.city}`,
    group: s.league || s.country,
  }),
  rugbyStadiums: (s) => ({
    id: s.id,
    name: `${s.name} - ${s.city}`,
    group: s.league || s.country,
  }),
  cricketStadiums: (s) => ({
    id: s.id,
    name: `${s.name} - ${s.city}`,
    group: s.country,
  }),
  f1Tracks: (t) => ({
    id: t.id,
    name: `${t.name} - ${t.circuit}`,
    group: t.country,
  }),
  marathons: (m) => ({
    id: m.id,
    name: `${m.name} (${m.month})`,
    group: m.country,
  }),
  airports: (a) => ({
    id: a.id,
    name: `${a.name} (${a.code})`,
    group: a.region,
    code: a.code,
  }),
  skiResorts: (r) => ({
    id: r.id,
    name: `${r.name} - ${r.location}`,
    group: r.region,
  }),
  themeParks: (p) => ({
    id: p.id,
    name: `${p.name} - ${p.location}`,
    group: p.region,
  }),
  surfingReserves: (s) => ({
    id: s.id,
    name: `${s.name} - ${s.country}`,
    group: s.region,
  }),
  weirdAmericana: (w) => ({
    id: w.id,
    name: `${w.name} - ${w.city}, ${w.state}`,
    group: w.region,
  }),
  countryHighPoints: (hp) => ({
    id: hp.id,
    name: `${hp.name} (${hp.elevation.toLocaleString()}m) - ${hp.country}`,
    group: hp.continent,
    code: hp.countryCode,
  }),
  unescoSites: (s) => ({
    id: s.id,
    name: s.country ? `${s.name} - ${s.country}` : s.name,
    group: s.type || s.region || 'World Heritage',
    code: s.countryCode,
    unescoId: s.unescoId,
  }),
};

// =====================
// DATA LOADERS MAP (OCP - Open for extension, closed for modification)
// =====================
// To add a new category: add entry here and in CATEGORY_SCHEMA (types.ts)
//
// Large datasets use loadWithJsonFallback() to prefer fetching from /data/categories/*.json
// which enables service worker caching and reduces initial bundle size (FCP/LCP optimization).
// Fallback to dynamic imports ensures backwards compatibility if JSON files are missing.
//
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DATA_LOADERS: Record<Category, () => Promise<any[]>> = {
  // Countries is small enough to keep as dynamic import
  countries: () => import('@/data/countries').then(m => m.countries),
  // Large datasets - prefer JSON fetch for better caching
  worldCities: () => loadWithJsonFallback('worldCities.json', () => import('@/data/worldCities').then(m => m.worldCities)),
  states: () => import('@/data/usStates').then(m => m.usStates),
  territories: () => import('@/data/usTerritories').then(m => m.usTerritories),
  usCities: () => loadWithJsonFallback('usCities.json', () => import('@/data/usCities').then(m => m.usCities)),
  nationalParks: () => loadWithJsonFallback('nationalParks.json', () => import('@/data/nationalParks').then(m => m.nationalParks)),
  nationalMonuments: () => loadWithJsonFallback('nationalMonuments.json', () => import('@/data/nationalMonuments').then(m => m.nationalMonuments)),
  stateParks: () => loadWithJsonFallback('stateParks.json', () => import('@/data/stateParks').then(m => m.stateParks)),
  fiveKPeaks: () => import('@/data/mountains').then(m => m.get5000mPeaks()),
  fourteeners: () => import('@/data/mountains').then(m => m.getUS14ers()),
  museums: () => loadWithJsonFallback('museums.json', () => import('@/data/museums').then(m => m.museums)),
  mlbStadiums: () => import('@/data/stadiums').then(m => m.getMlbStadiums()),
  nflStadiums: () => import('@/data/stadiums').then(m => m.getNflStadiums()),
  nbaStadiums: () => import('@/data/stadiums').then(m => m.getNbaStadiums()),
  nhlStadiums: () => import('@/data/stadiums').then(m => m.getNhlStadiums()),
  soccerStadiums: () => import('@/data/stadiums').then(m => m.getSoccerStadiums()),
  euroFootballStadiums: () => import('@/data/stadiums/stadiumUtils').then(m => m.getEuroFootballStadiums()),
  rugbyStadiums: () => import('@/data/stadiums/stadiumUtils').then(m => m.getRugbyStadiums()),
  cricketStadiums: () => import('@/data/stadiums/stadiumUtils').then(m => m.getCricketStadiums()),
  f1Tracks: () => import('@/data/f1Tracks').then(m => m.f1Tracks),
  marathons: () => import('@/data/marathons').then(m => m.marathons),
  airports: () => loadWithJsonFallback('airports.json', () => import('@/data/airports').then(m => m.airports)),
  skiResorts: () => loadWithJsonFallback('skiResorts.json', () => import('@/data/skiResorts').then(m => m.skiResorts)),
  themeParks: () => loadWithJsonFallback('themeParks.json', () => import('@/data/themeParks').then(m => m.themeParks)),
  surfingReserves: () => import('@/data/surfingReserves').then(m => m.surfingReserves),
  weirdAmericana: () => loadWithJsonFallback('weirdAmericana.json', () => import('@/data/weirdAmericana').then(m => m.weirdAmericana)),
  countryHighPoints: () => loadWithJsonFallback('countryHighPoints.json', () => import('@/data/countryHighPoints').then(m => m.countryHighPoints)),
  unescoSites: () => loadWithJsonFallback('unescoSites.json', () => import('@/data/unescoSites').then(m => m.unescoSites)),
};

// Dynamic data loaders - only load when needed
// Exported for use by marker maps and other components that need raw data
export async function loadCategoryData(category: Category): Promise<CategoryDataItem[]> {
  // Return cached data if available
  if (dataCache[category]) {
    return dataCache[category]!;
  }

  const loader = DATA_LOADERS[category];
  if (!loader) {
    console.error(`No loader found for category: ${category}`);
    return [];
  }

  const data = await loader();
  dataCache[category] = data as CategoryDataItem[];
  return dataCache[category]!;
}

// Async function to get category items - loads data on demand
export async function getCategoryItemsAsync(category: Category): Promise<CategoryItem[]> {
  const data = await loadCategoryData(category);
  const transform = transforms[category];
  if (!transform) return [];
  return data.map(transform);
}

// Synchronous version for backwards compatibility - uses cached data or returns empty
// Prefer using getCategoryItemsAsync for new code
export function getCategoryItems(category: Category): CategoryItem[] {
  const data = dataCache[category];
  if (!data) return [];
  const transform = transforms[category];
  if (!transform) return [];
  return data.map(transform);
}

// Preload a category's data (useful for prefetching)
export async function preloadCategoryData(category: Category): Promise<void> {
  await loadCategoryData(category);
}
