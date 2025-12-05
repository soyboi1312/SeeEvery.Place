import { Category } from '@/lib/types';

// Data Imports
import { countries } from '@/data/countries';
import { usStates } from '@/data/usStates';
import { nationalParks } from '@/data/nationalParks';
import { stateParks } from '@/data/stateParks';
import { unescoSites } from '@/data/unescoSites';
import { get5000mPeaks, getUS14ers } from '@/data/mountains';
import { museums } from '@/data/museums';
import { getMlbStadiums, getNflStadiums, getNbaStadiums, getNhlStadiums, getSoccerStadiums } from '@/data/stadiums';
import { f1Tracks } from '@/data/f1Tracks';
import { marathons } from '@/data/marathons';
import { airports } from '@/data/airports';
import { skiResorts } from '@/data/skiResorts';
import { themeParks } from '@/data/themeParks';
import { surfingReserves } from '@/data/surfingReserves';

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

// Define totals for all distinct categories
export const categoryTotals: Record<Category, number> = {
  countries: countries.length,
  states: usStates.length,
  nationalParks: nationalParks.length,
  stateParks: stateParks.length,
  unesco: unescoSites.length,
  fiveKPeaks: get5000mPeaks().length,
  fourteeners: getUS14ers().length,
  museums: museums.length,
  mlbStadiums: getMlbStadiums().length,
  nflStadiums: getNflStadiums().length,
  nbaStadiums: getNbaStadiums().length,
  nhlStadiums: getNhlStadiums().length,
  soccerStadiums: getSoccerStadiums().length,
  f1Tracks: f1Tracks.length,
  marathons: marathons.length,
  airports: airports.length,
  skiResorts: skiResorts.length,
  themeParks: themeParks.length,
  surfingReserves: surfingReserves.length,
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

// Category data configuration - maps category to data source and transformer
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CategoryConfig = {
  getData: () => any[];
  transform: (item: any) => CategoryItem;
};

const categoryConfig: Record<Category, CategoryConfig> = {
  countries: {
    getData: () => countries,
    transform: (c) => ({
      id: c.code,
      name: c.name,
      group: c.continent,
      code: c.code,
      aliases: countryAliases[c.code] || [],
    }),
  },
  states: {
    getData: () => usStates,
    transform: (s) => ({
      id: s.code,
      name: s.name,
      group: s.region,
      code: s.code,
      aliases: stateAliases[s.code] || [],
    }),
  },
  nationalParks: {
    getData: () => nationalParks,
    transform: (p) => ({
      id: p.id,
      name: p.name,
      group: p.region,
      subcategory: p.type,
    }),
  },
  stateParks: {
    getData: () => stateParks,
    transform: (p) => ({
      id: p.id,
      name: `${p.name} - ${p.state}`,
      group: p.region,
    }),
  },
  unesco: {
    getData: () => unescoSites,
    transform: (u) => ({
      id: u.id,
      name: u.name,
      group: u.country,
    }),
  },
  fiveKPeaks: {
    getData: () => get5000mPeaks(),
    transform: (m) => ({
      id: m.id,
      name: `${m.name} (${m.elevation.toLocaleString()}m)`,
      group: m.range,
    }),
  },
  fourteeners: {
    getData: () => getUS14ers(),
    transform: (m) => ({
      id: m.id,
      name: `${m.name} (${m.elevation.toLocaleString()}m)`,
      group: m.range,
    }),
  },
  museums: {
    getData: () => museums,
    transform: (m) => ({
      id: m.id,
      name: `${m.name} - ${m.city}`,
      group: m.country,
    }),
  },
  mlbStadiums: {
    getData: () => getMlbStadiums(),
    transform: (s) => ({
      id: s.id,
      name: `${s.name} - ${s.city}`,
      group: s.team || s.city,
    }),
  },
  nflStadiums: {
    getData: () => getNflStadiums(),
    transform: (s) => ({
      id: s.id,
      name: `${s.name} - ${s.city}`,
      group: s.team || s.city,
    }),
  },
  nbaStadiums: {
    getData: () => getNbaStadiums(),
    transform: (s) => ({
      id: s.id,
      name: `${s.name} - ${s.city}`,
      group: s.team || s.city,
    }),
  },
  nhlStadiums: {
    getData: () => getNhlStadiums(),
    transform: (s) => ({
      id: s.id,
      name: `${s.name} - ${s.city}`,
      group: s.team || s.city,
    }),
  },
  soccerStadiums: {
    getData: () => getSoccerStadiums(),
    transform: (s) => ({
      id: s.id,
      name: `${s.name} - ${s.city}`,
      group: s.country,
    }),
  },
  f1Tracks: {
    getData: () => f1Tracks,
    transform: (t) => ({
      id: t.id,
      name: `${t.name} - ${t.circuit}`,
      group: t.country,
    }),
  },
  marathons: {
    getData: () => marathons,
    transform: (m) => ({
      id: m.id,
      name: `${m.name} (${m.month})`,
      group: m.country,
    }),
  },
  airports: {
    getData: () => airports,
    transform: (a) => ({
      id: a.id,
      name: `${a.name} (${a.code})`,
      group: a.region,
      code: a.code,
    }),
  },
  skiResorts: {
    getData: () => skiResorts,
    transform: (r) => ({
      id: r.id,
      name: `${r.name} - ${r.location}`,
      group: r.region,
    }),
  },
  themeParks: {
    getData: () => themeParks,
    transform: (p) => ({
      id: p.id,
      name: `${p.name} - ${p.location}`,
      group: p.region,
    }),
  },
  surfingReserves: {
    getData: () => surfingReserves,
    transform: (s) => ({
      id: s.id,
      name: `${s.name} - ${s.country}`,
      group: s.region,
    }),
  },
};

// Get items for a specific category using strategy pattern
export function getCategoryItems(category: Category): CategoryItem[] {
  const config = categoryConfig[category];
  if (!config) return [];
  return config.getData().map(config.transform);
}
