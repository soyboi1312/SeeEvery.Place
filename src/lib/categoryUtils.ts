import { Category } from '@/lib/types';

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
}

// Static totals - precomputed to avoid loading all data at once
// Update these values when adding/removing items from data files
export const categoryTotals: Record<Category, number> = {
  countries: 197,
  states: 51,
  nationalParks: 63,
  stateParks: 304,
  unesco: 213,
  fiveKPeaks: 37,
  fourteeners: 62,
  museums: 46,
  mlbStadiums: 33,
  nflStadiums: 32,
  nbaStadiums: 30,
  nhlStadiums: 32,
  soccerStadiums: 48,
  f1Tracks: 34,
  marathons: 7,
  airports: 58,
  skiResorts: 32,
  themeParks: 37,
  surfingReserves: 26,
};

// Category display titles
export const categoryTitles: Record<Category, string> = {
  countries: 'Countries of the World',
  states: 'US States & Territories',
  nationalParks: 'National Parks',
  stateParks: 'State Parks',
  unesco: 'UNESCO World Heritage Sites',
  fiveKPeaks: '5000m+ Mountain Peaks',
  fourteeners: 'US 14ers (14,000+ ft)',
  museums: 'Famous Museums',
  mlbStadiums: 'MLB Stadiums',
  nflStadiums: 'NFL Stadiums',
  nbaStadiums: 'NBA Arenas',
  nhlStadiums: 'NHL Arenas',
  soccerStadiums: 'Soccer Stadiums',
  f1Tracks: 'Formula 1 Race Tracks',
  marathons: 'World Marathon Majors',
  airports: 'Major World Airports',
  skiResorts: 'World Ski Resorts',
  themeParks: 'Theme Parks & Attractions',
  surfingReserves: 'World Surfing Reserves',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TransformFn = (item: any) => CategoryItem;

// Transform functions for each category
const transforms: Record<Category, TransformFn> = {
  countries: (c) => ({
    id: c.code,
    name: c.name,
    group: c.continent,
    code: c.code,
    aliases: countryAliases[c.code] || [],
  }),
  states: (s) => ({
    id: s.code,
    name: s.name,
    group: s.region,
    code: s.code,
    aliases: stateAliases[s.code] || [],
  }),
  nationalParks: (p) => ({
    id: p.id,
    name: p.name,
    group: p.region,
    subcategory: p.type,
  }),
  stateParks: (p) => ({
    id: p.id,
    name: `${p.name} - ${p.state}`,
    group: p.region,
  }),
  unesco: (u) => ({
    id: u.id,
    name: u.name,
    group: u.country,
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
};

// Cache for loaded data to avoid re-importing
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dataCache: Partial<Record<Category, any[]>> = {};

// Dynamic data loaders - only load when needed
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function loadCategoryData(category: Category): Promise<any[]> {
  // Return cached data if available
  if (dataCache[category]) {
    return dataCache[category]!;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let data: any[];
  switch (category) {
    case 'countries':
      data = (await import('@/data/countries')).countries;
      break;
    case 'states':
      data = (await import('@/data/usStates')).usStates;
      break;
    case 'nationalParks':
      data = (await import('@/data/nationalParks')).nationalParks;
      break;
    case 'stateParks':
      data = (await import('@/data/stateParks')).stateParks;
      break;
    case 'unesco':
      data = (await import('@/data/unescoSites')).unescoSites;
      break;
    case 'fiveKPeaks':
      data = (await import('@/data/mountains')).get5000mPeaks();
      break;
    case 'fourteeners':
      data = (await import('@/data/mountains')).getUS14ers();
      break;
    case 'museums':
      data = (await import('@/data/museums')).museums;
      break;
    case 'mlbStadiums':
      data = (await import('@/data/stadiums')).getMlbStadiums();
      break;
    case 'nflStadiums':
      data = (await import('@/data/stadiums')).getNflStadiums();
      break;
    case 'nbaStadiums':
      data = (await import('@/data/stadiums')).getNbaStadiums();
      break;
    case 'nhlStadiums':
      data = (await import('@/data/stadiums')).getNhlStadiums();
      break;
    case 'soccerStadiums':
      data = (await import('@/data/stadiums')).getSoccerStadiums();
      break;
    case 'f1Tracks':
      data = (await import('@/data/f1Tracks')).f1Tracks;
      break;
    case 'marathons':
      data = (await import('@/data/marathons')).marathons;
      break;
    case 'airports':
      data = (await import('@/data/airports')).airports;
      break;
    case 'skiResorts':
      data = (await import('@/data/skiResorts')).skiResorts;
      break;
    case 'themeParks':
      data = (await import('@/data/themeParks')).themeParks;
      break;
    case 'surfingReserves':
      data = (await import('@/data/surfingReserves')).surfingReserves;
      break;
    default:
      data = [];
  }

  // Cache the loaded data
  dataCache[category] = data;
  return data;
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
