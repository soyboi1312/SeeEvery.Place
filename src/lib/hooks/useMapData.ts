/**
 * Custom hooks for map data lookup
 * Extracted to follow DRY principle - used by all map components
 */
import { useMemo, useCallback, useState, useEffect } from 'react';
import { Category, Status, UserSelections } from '@/lib/types';
import { MarkerData, getMarkersFromData } from '@/lib/markerUtils';
import { loadCategoryData } from '@/lib/categoryUtils';

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
 * Hook for loading category markers with async data fetching
 * Follows Interface Segregation Principle - separates data fetching from presentation
 */
export function useCategoryMarkers(
  category: Category,
  selections: UserSelections,
  filterAlbersUsa: boolean,
  subcategory?: string
): MarkerData[] {
  const [markers, setMarkers] = useState<MarkerData[]>([]);

  useEffect(() => {
    let isMounted = true;

    const loadMarkers = async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = await loadCategoryData(category) as any[];

      if (isMounted) {
        const generatedMarkers = getMarkersFromData(
          category,
          data,
          selections,
          filterAlbersUsa,
          subcategory
        );
        setMarkers(generatedMarkers);
      }
    };

    loadMarkers();

    return () => { isMounted = false; };
  }, [category, selections, subcategory, filterAlbersUsa]);

  return markers;
}
