/**
 * Custom hooks for map data lookup
 * Extracted to follow DRY principle - used by all map components
 */
import { useMemo, useCallback } from 'react';
import { Status } from '@/lib/types';

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
