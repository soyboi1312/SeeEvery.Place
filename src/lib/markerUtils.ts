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

/**
 * Interface for items that can be rendered as map markers.
 * Used by getMarkersFromData to filter and transform category data.
 * Items without lat/lng (e.g., countries using polygon rendering) are filtered out.
 */
export interface MarkerableItem {
  id: string;
  lat?: number;
  lng?: number;
  type?: string; // For parks with subcategory filtering
  state?: string; // State code (e.g., "CA", "NY") for US filtering
  countryCode?: string; // Country code (e.g., "US", "JP") for world filtering
  country?: string; // Full country name for fallback matching
}

/**
 * Filter criteria for restricting markers to a specific region
 */
export interface RegionFilter {
  state?: string; // Filter by US state code
  country?: string; // Filter by country code
}

/**
 * Visibility filter for marker statuses.
 * Each status can be toggled on/off independently via the legend.
 */
export interface StatusVisibility {
  visited: boolean;
  bucketList: boolean;
  unvisited: boolean;
}

/**
 * Generate markers from loaded category data.
 * This is a pure function that processes data arrays into markers
 * without importing the data itself.
 * Items without lat/lng coordinates are filtered out (e.g., countries use polygons).
 *
 * FIX: Iterates over DATA (all items) instead of SELECTIONS to show unvisited markers.
 */
export function getMarkersFromData(
  category: Category,
  data: MarkerableItem[],
  selections: UserSelections,
  filterAlbersUsa = false,
  subcategory?: string,
  regionFilter?: RegionFilter,
  statusVisibility?: StatusVisibility
): MarkerData[] {
  const markers: MarkerData[] = [];
  const categorySelections = selections[category] || [];

  // Create a quick lookup map for selections (visited/bucketList items)
  const selectionMap = new Map<string, { status: Status }>();
  for (const s of categorySelections) {
    if (!s.deleted) {
      selectionMap.set(s.id, { status: s.status });
    }
  }

  // Pre-compute sport type
  const sportType = stadiumCategoryToSport[category];

  // Iterate over ALL data items to generate markers (visited and unvisited)
  for (const item of data) {
    // Skip items without coordinates
    if (!item.lat || !item.lng) continue;

    // Filter out unsupported Albers USA territories if requested
    if (filterAlbersUsa && UNSUPPORTED_ALBERS_USA_IDS.has(item.id)) {
      continue;
    }

    // Apply region filtering if provided
    if (regionFilter) {
      if (regionFilter.state) {
        // Check if item's state matches (handle multi-state items like "WY/MT/ID")
        const itemState = item.state?.toUpperCase() || '';
        const filterState = regionFilter.state.toUpperCase();
        if (itemState !== filterState && !itemState.includes(filterState)) {
          continue;
        }
      }
      if (regionFilter.country) {
        // Check countryCode first, fallback to checking country name
        const filterCountry = regionFilter.country.toUpperCase();
        const itemCode = item.countryCode?.toUpperCase();
        if (itemCode !== filterCountry) {
          continue;
        }
      }
    }

    // Handle National Parks types/subcategories
    let parkType: string | undefined;
    if (category === 'nationalParks' && item.type) {
      parkType = item.type;
      if (subcategory && subcategory !== 'All' && item.type !== subcategory) {
        continue;
      }
    }

    // Get status from selections or default to 'unvisited'
    const selection = selectionMap.get(item.id);
    const status: Status = selection ? selection.status : 'unvisited';

    // Skip markers based on status visibility filter
    if (statusVisibility) {
      if (status === 'visited' && !statusVisibility.visited) continue;
      if (status === 'bucketList' && !statusVisibility.bucketList) continue;
      if (status === 'unvisited' && !statusVisibility.unvisited) continue;
    }

    const marker: MarkerData = {
      coordinates: [item.lng, item.lat],
      status: status,
      id: item.id,
    };

    if (sportType) {
      marker.sport = sportType;
    }

    if (parkType) {
      marker.parkType = parkType;
    }

    markers.push(marker);
  }

  return markers;
}
