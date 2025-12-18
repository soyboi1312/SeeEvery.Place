/**
 * Custom hooks for map data lookup
 * Extracted to follow DRY principle - used by all map components
 */
import { useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Category, Status, UserSelections } from '@/lib/types';
import { MarkerData, MarkerableItem, getMarkersFromData, RegionFilter } from '@/lib/markerUtils';
import { loadCategoryData, CategoryDataItem } from '@/lib/categoryUtils';

// Selection type used across map components
interface Selection {
  id: string;
  status: Status;
  deleted?: boolean;
}

// Item type for name lookup
interface NamedItem {
  id: string;
  name: string;
}

/**
 * Creates an optimized O(1) lookup map for selection statuses
 * Filters out soft-deleted selections
 */
export function useStatusLookup(selections: Selection[] | undefined) {
  return useMemo(() => {
    const map = new Map<string, Status>();
    if (selections) {
      for (const sel of selections) {
        if (!sel.deleted) {
          map.set(sel.id, sel.status);
        }
      }
    }
    return map;
  }, [selections]);
}

/**
 * Creates an optimized O(1) lookup map for item names
 */
export function useNameLookup(items: NamedItem[] | undefined) {
  return useMemo(() => {
    const map = new Map<string, string>();
    if (items) {
      for (const item of items) {
        map.set(item.id, item.name);
      }
    }
    return map;
  }, [items]);
}

/**
 * Returns a memoized function for getting item names with fallback
 */
export function useNameGetter(items: NamedItem[] | undefined) {
  const nameMap = useNameLookup(items);
  return useCallback((id: string) => nameMap.get(id) || id, [nameMap]);
}

/**
 * Determines marker size based on zoom level
 * Centralized logic to avoid repetition across marker maps
 */
export function getMarkerSize(zoom: number): 'small' | 'default' {
  return zoom < 2 ? 'small' : 'default';
}

/**
 * Hook for loading category data with React Query caching
 * The heavy JSON data is cached to prevent repeated network/parsing overhead
 */
export function useCategoryData(category: Category) {
  return useQuery<CategoryDataItem[]>({
    queryKey: ['categoryData', category],
    queryFn: () => loadCategoryData(category),
    // Category data is static, can be cached indefinitely
    staleTime: Infinity,
    gcTime: Infinity,
  });
}

/**
 * Hook for loading category markers with async data fetching
 * Follows Interface Segregation Principle - separates data fetching from presentation
 * Uses React Query for caching the heavy category data
 */
export function useCategoryMarkers(
  category: Category,
  selections: UserSelections,
  filterAlbersUsa: boolean,
  subcategory?: string,
  regionFilter?: RegionFilter
): MarkerData[] {
  // Use React Query to cache the heavy category data
  const { data: categoryData } = useCategoryData(category);

  // Derive markers from cached data when selections change
  const markers = useMemo(() => {
    if (!categoryData) return [];

    // CategoryDataItem is a union of all category types; MarkerableItem is the
    // minimal interface needed for marker generation. Items without lat/lng
    // (e.g., countries which use polygon rendering) are filtered out by getMarkersFromData.
    return getMarkersFromData(
      category,
      categoryData as MarkerableItem[],
      selections,
      filterAlbersUsa,
      subcategory,
      regionFilter
    );
  }, [category, categoryData, selections, filterAlbersUsa, subcategory, regionFilter]);

  return markers;
}
