/**
 * Place Lookup Utility for Admin Analytics
 * Maps place IDs to their full details from data files
 */

import { Category } from '@/lib/types';
import { nationalParks } from '@/data/nationalParks';
import { museums } from '@/data/museums';
import { marathons } from '@/data/marathons';
import { mountains, getUS14ers } from '@/data/mountains';
import { f1Tracks } from '@/data/f1Tracks';
import { airports } from '@/data/airports';
import { skiResorts } from '@/data/skiResorts';
import { themeParks } from '@/data/themeParks';
import { surfingReserves } from '@/data/surfingReserves';
import { nationalMonuments } from '@/data/nationalMonuments';
import { stateParks } from '@/data/stateParks';
import { weirdAmericana } from '@/data/weirdAmericana';
import {
  mlbStadiums,
  nflStadiums,
  nbaStadiums,
  nhlStadiums,
  soccerStadiums
} from '@/data/stadiums/index';

export interface PlaceDetails {
  id: string;
  name: string;
  location: string;
  coordinates: { lat: number; lng: number } | null;
  type?: string;
  googleMapsUrl?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractPlaceDetails(item: any, locationFields: string[]): PlaceDetails {
  const location = locationFields
    .map(field => item[field])
    .filter(Boolean)
    .join(', ');

  const coords = item.lat && item.lng
    ? { lat: item.lat, lng: item.lng }
    : null;

  return {
    id: item.id,
    name: item.name,
    location,
    coordinates: coords,
    type: item.type,
    googleMapsUrl: coords
      ? `https://www.google.com/maps?q=${coords.lat},${coords.lng}`
      : undefined,
  };
}

export function lookupPlace(category: Category, id: string): PlaceDetails | null {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let dataSource: any[] = [];
  let locationFields: string[] = [];

  switch (category) {
    case 'nationalParks':
      dataSource = nationalParks;
      locationFields = ['state', 'region'];
      break;
    case 'museums':
      dataSource = museums;
      locationFields = ['city', 'country'];
      break;
    case 'marathons':
      dataSource = marathons;
      locationFields = ['city', 'country'];
      break;
    case 'fiveKPeaks':
      dataSource = mountains;
      locationFields = ['country', 'range'];
      break;
    case 'fourteeners':
      dataSource = getUS14ers();
      locationFields = ['country', 'range'];
      break;
    case 'f1Tracks':
      dataSource = f1Tracks;
      locationFields = ['country'];
      break;
    case 'airports':
      dataSource = airports;
      locationFields = ['city', 'country'];
      break;
    case 'skiResorts':
      dataSource = skiResorts;
      locationFields = ['country', 'region'];
      break;
    case 'themeParks':
      dataSource = themeParks;
      locationFields = ['city', 'country'];
      break;
    case 'surfingReserves':
      dataSource = surfingReserves;
      locationFields = ['country'];
      break;
    case 'nationalMonuments':
      dataSource = nationalMonuments;
      locationFields = ['state', 'region'];
      break;
    case 'stateParks':
      dataSource = stateParks;
      locationFields = ['state', 'region'];
      break;
    case 'weirdAmericana':
      dataSource = weirdAmericana;
      locationFields = ['state', 'city'];
      break;
    case 'mlbStadiums':
      dataSource = mlbStadiums;
      locationFields = ['city', 'state'];
      break;
    case 'nflStadiums':
      dataSource = nflStadiums;
      locationFields = ['city', 'state'];
      break;
    case 'nbaStadiums':
      dataSource = nbaStadiums;
      locationFields = ['city', 'state'];
      break;
    case 'nhlStadiums':
      dataSource = nhlStadiums;
      locationFields = ['city', 'state'];
      break;
    case 'soccerStadiums':
      dataSource = soccerStadiums;
      locationFields = ['city', 'country'];
      break;
    default:
      return null;
  }

  const item = dataSource.find(p => p.id === id);
  if (!item) return null;

  return extractPlaceDetails(item, locationFields);
}

// Prebuilt lookup maps for faster access
const lookupMaps: Partial<Record<Category, Map<string, PlaceDetails>>> = {};

export function getPlaceDetailsMap(category: Category): Map<string, PlaceDetails> {
  if (lookupMaps[category]) {
    return lookupMaps[category]!;
  }

  const map = new Map<string, PlaceDetails>();
  // Build the map by looking up each item
  // This is lazy-loaded on first access

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let dataSource: any[] = [];
  let locationFields: string[] = [];

  switch (category) {
    case 'nationalParks':
      dataSource = nationalParks;
      locationFields = ['state', 'region'];
      break;
    case 'museums':
      dataSource = museums;
      locationFields = ['city', 'country'];
      break;
    case 'marathons':
      dataSource = marathons;
      locationFields = ['city', 'country'];
      break;
    case 'fiveKPeaks':
      dataSource = mountains;
      locationFields = ['country', 'range'];
      break;
    case 'fourteeners':
      dataSource = getUS14ers();
      locationFields = ['country', 'range'];
      break;
    case 'f1Tracks':
      dataSource = f1Tracks;
      locationFields = ['country'];
      break;
    case 'airports':
      dataSource = airports;
      locationFields = ['city', 'country'];
      break;
    case 'skiResorts':
      dataSource = skiResorts;
      locationFields = ['country', 'region'];
      break;
    case 'themeParks':
      dataSource = themeParks;
      locationFields = ['city', 'country'];
      break;
    case 'surfingReserves':
      dataSource = surfingReserves;
      locationFields = ['country'];
      break;
    case 'nationalMonuments':
      dataSource = nationalMonuments;
      locationFields = ['state', 'region'];
      break;
    case 'stateParks':
      dataSource = stateParks;
      locationFields = ['state', 'region'];
      break;
    case 'weirdAmericana':
      dataSource = weirdAmericana;
      locationFields = ['state', 'city'];
      break;
    case 'mlbStadiums':
      dataSource = mlbStadiums;
      locationFields = ['city', 'state'];
      break;
    case 'nflStadiums':
      dataSource = nflStadiums;
      locationFields = ['city', 'state'];
      break;
    case 'nbaStadiums':
      dataSource = nbaStadiums;
      locationFields = ['city', 'state'];
      break;
    case 'nhlStadiums':
      dataSource = nhlStadiums;
      locationFields = ['city', 'state'];
      break;
    case 'soccerStadiums':
      dataSource = soccerStadiums;
      locationFields = ['city', 'country'];
      break;
    default:
      return map;
  }

  for (const item of dataSource) {
    map.set(item.id, extractPlaceDetails(item, locationFields));
  }

  lookupMaps[category] = map;
  return map;
}
