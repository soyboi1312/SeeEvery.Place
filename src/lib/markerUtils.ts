/**
 * src/lib/markerUtils.ts
 * Pure utility functions for generating map markers.
 * Decoupled from data sources to allow for lazy loading.
 */

import { Category, UserSelections, Status } from '@/lib/types';
import { stadiumCategoryToSport, UNSUPPORTED_ALBERS_USA_IDS } from './mapConstants';

// Marker type with optional sport field for stadiums and parkType for parks
export interface MarkerData {
  coordinates: [number, number];
  status: Status;
  id: string;
  sport?: string;
  parkType?: string;
}

// Helper interface for raw data items (duck typing)
interface CoordinateItem {
  id: string;
  lat: number;
  lng: number;
  type?: string; // For parks
}

/**
 * Generate markers from loaded category data.
 * This is a pure function that processes data arrays into markers
 * without importing the data itself.
 */
export function getMarkersFromData(
  category: Category,
  data: CoordinateItem[],
  selections: UserSelections,
  filterAlbersUsa = false,
  subcategory?: string
): MarkerData[] {
  const markers: MarkerData[] = [];
  const categorySelections = selections[category] || [];

  // Create a quick lookup map for the current data
  // This is O(N) but N is small per category (max ~500 items)
  // and this runs only when that category is active
  const dataMap = new Map<string, CoordinateItem>();
  for (const item of data) {
    dataMap.set(item.id, item);
  }

  // Pre-compute sport type
  const sportType = stadiumCategoryToSport[category];

  for (const selection of categorySelections) {
    // Skip soft-deleted selections
    if (selection.deleted) continue;

    // Filter out unsupported Albers USA territories if requested
    if (filterAlbersUsa && UNSUPPORTED_ALBERS_USA_IDS.has(selection.id)) {
      continue;
    }

    const item = dataMap.get(selection.id);
    if (!item || !item.lat || !item.lng) continue;

    const marker: MarkerData = {
      coordinates: [item.lng, item.lat],
      status: selection.status,
      id: selection.id,
    };

    if (sportType) {
      marker.sport = sportType;
    }

    // Handle National Parks types/subcategories
    if (category === 'nationalParks' && item.type) {
      marker.parkType = item.type;
      if (subcategory && subcategory !== 'All' && item.type !== subcategory) {
        continue;
      }
    }

    markers.push(marker);
  }

  return markers;
}
