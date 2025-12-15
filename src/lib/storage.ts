import { UserSelections, emptySelections, Selection, Status, Category } from './types';

// Removed static imports of heavy data files to reduce initial bundle size
// Data is now loaded dynamically only when needed

// Lazy-loaded lookup maps
let usCityToState: Map<string, string> | null = null;
let worldCityToCountry: Map<string, string> | null = null;
let worldCityToState: Map<string, string> | null = null;
let availableCountryCodes: Set<string> | null = null;

const STORAGE_KEY = 'travelmap_selections';

/**
 * Parse JSON using requestIdleCallback to avoid blocking the main thread
 * during hydration. Falls back to synchronous parsing if requestIdleCallback
 * is not available or if the deadline has passed.
 */
function parseJsonAsync<T>(jsonString: string): Promise<T> {
  return new Promise((resolve, reject) => {
    // If requestIdleCallback is available, use it to defer parsing
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(
        (deadline) => {
          try {
            // If we have time remaining, parse synchronously
            // Otherwise, fall back to setTimeout to yield to more critical work
            if (deadline.timeRemaining() > 5) {
              resolve(JSON.parse(jsonString));
            } else {
              // Break up the work with setTimeout
              setTimeout(() => {
                try {
                  resolve(JSON.parse(jsonString));
                } catch (e) {
                  reject(e);
                }
              }, 0);
            }
          } catch (e) {
            reject(e);
          }
        },
        { timeout: 1000 } // Max 1 second delay before parsing anyway
      );
    } else {
      // Fallback for browsers without requestIdleCallback (Safari < 16.4)
      // Use setTimeout to at least yield to the event loop once
      setTimeout(() => {
        try {
          resolve(JSON.parse(jsonString));
        } catch (e) {
          reject(e);
        }
      }, 0);
    }
  });
}

/**
 * Stringify JSON using requestIdleCallback to avoid blocking during saves
 * with large datasets
 */
function stringifyJsonAsync(data: unknown): Promise<string> {
  return new Promise((resolve, reject) => {
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(
        (deadline) => {
          try {
            if (deadline.timeRemaining() > 5) {
              resolve(JSON.stringify(data));
            } else {
              setTimeout(() => {
                try {
                  resolve(JSON.stringify(data));
                } catch (e) {
                  reject(e);
                }
              }, 0);
            }
          } catch (e) {
            reject(e);
          }
        },
        { timeout: 500 }
      );
    } else {
      setTimeout(() => {
        try {
          resolve(JSON.stringify(data));
        } catch (e) {
          reject(e);
        }
      }, 0);
    }
  });
}

// 365 days in milliseconds for cleanup of permanently deleted items
// Must match sync.ts DELETED_RETENTION_MS to prevent zombie items during cloud sync
const PERMANENT_DELETE_THRESHOLD_MS = 365 * 24 * 60 * 60 * 1000;

// Helper to ensure city data is loaded before applying relationships
export async function preloadCityData() {
  if (usCityToState && worldCityToCountry && worldCityToState && availableCountryCodes) return;

  const [
    { usCities },
    { worldCities },
    { countries }
  ] = await Promise.all([
    import('@/data/usCities'),
    import('@/data/worldCities'),
    import('@/data/countries')
  ]);

  usCityToState = new Map(usCities.map(c => [c.id, c.stateCode]));
  worldCityToCountry = new Map(worldCities.map(c => [c.id, c.countryCode]));
  worldCityToState = new Map(
    worldCities.filter(c => c.stateCode).map(c => [c.id, c.stateCode!])
  );
  availableCountryCodes = new Set(countries.map(c => c.code));
}

// Clean up items that have been soft-deleted for more than 365 days
// This prevents localStorage from growing indefinitely while maintaining
// tombstones long enough to prevent zombie items during cloud sync
function cleanupOldDeletedItems(parsed: Record<string, Selection[]>): { data: Record<string, Selection[]>; cleaned: boolean } {
  const now = Date.now();
  let cleaned = false;

  const result: Record<string, Selection[]> = {};

  for (const [category, selections] of Object.entries(parsed)) {
    if (!Array.isArray(selections)) {
      result[category] = selections;
      continue;
    }

    result[category] = selections.filter((selection: Selection) => {
      // Keep if not deleted
      if (!selection.deleted) return true;

      // Keep if deleted but no timestamp (legacy data)
      if (!selection.updatedAt) return true;

      // Remove if deleted for more than 30 days
      const deletedDuration = now - selection.updatedAt;
      if (deletedDuration > PERMANENT_DELETE_THRESHOLD_MS) {
        cleaned = true;
        return false;
      }

      return true;
    });
  }

  return { data: result, cleaned };
}

// Async migration using dynamic imports
async function migrateStadiumSelections(parsed: Record<string, Selection[]>): Promise<Record<string, Selection[]>> {
  // Check if we have a merged stadiums category to split
  if (!parsed.stadiums || parsed.stadiums.length === 0) {
    return parsed;
  }

  const { stadiums } = await import('@/data/stadiums');

  const result = { ...parsed };
  const mergedStadiumSelections = parsed.stadiums;

  // Initialize individual stadium categories if they don't exist
  if (!result.mlbStadiums) result.mlbStadiums = [];
  if (!result.nflStadiums) result.nflStadiums = [];
  if (!result.nbaStadiums) result.nbaStadiums = [];
  if (!result.nhlStadiums) result.nhlStadiums = [];
  if (!result.soccerStadiums) result.soccerStadiums = [];

  // Distribute merged stadium selections to individual categories based on sport
  mergedStadiumSelections.forEach((selection: Selection) => {
    const stadium = stadiums.find(s => s.id === selection.id);
    if (!stadium) return;

    let targetCategory: string;
    switch (stadium.sport) {
      case 'Baseball':
        targetCategory = 'mlbStadiums';
        break;
      case 'American Football':
        targetCategory = 'nflStadiums';
        break;
      case 'Basketball':
        targetCategory = 'nbaStadiums';
        break;
      case 'Hockey':
        targetCategory = 'nhlStadiums';
        break;
      case 'Football': // Soccer
        targetCategory = 'soccerStadiums';
        break;
      default:
        // Skip other sports (Cricket, Rugby, Tennis, Motorsport) - they don't have dedicated categories
        return;
    }

    // Check if already exists in target category
    const exists = result[targetCategory].some((s: Selection) => s.id === selection.id);
    if (!exists) {
      result[targetCategory].push(selection);
    }
  });

  // Remove the merged stadiums key
  delete result.stadiums;

  return result;
}

// Async migration using dynamic imports
async function migrateMountainSelections(parsed: Record<string, Selection[]>): Promise<Record<string, Selection[]>> {
  if (!parsed.mountains || parsed.mountains.length === 0) {
    return parsed;
  }

  const { mountains } = await import('@/data/mountains');

  const result = { ...parsed };
  const oldMountainSelections = parsed.mountains;

  // Create maps for categorization
  // 5000m+ peaks: elevation >= 5000m
  // US 14ers: elevation >= 4267m (14,000 ft) AND countryCode === 'US'
  const fiveKPeakIds = new Set(
    mountains.filter(m => m.elevation >= 5000).map(m => m.id)
  );
  const fourteenerIds = new Set(
    mountains.filter(m => m.elevation >= 4267 && m.countryCode === 'US').map(m => m.id)
  );

  // Initialize new categories if they don't exist
  if (!result.fiveKPeaks) result.fiveKPeaks = [];
  if (!result.fourteeners) result.fourteeners = [];

  // Distribute old mountain selections to new categories
  oldMountainSelections.forEach((selection: Selection) => {
    // Check if it's a 5000m+ peak
    if (fiveKPeakIds.has(selection.id)) {
      const exists = result.fiveKPeaks.some((s: Selection) => s.id === selection.id);
      if (!exists) {
        result.fiveKPeaks.push(selection);
      }
    }
    // Check if it's a US 14er
    if (fourteenerIds.has(selection.id)) {
      const exists = result.fourteeners.some((s: Selection) => s.id === selection.id);
      if (!exists) {
        result.fourteeners.push(selection);
      }
    }
  });

  // Remove old mountains key
  delete result.mountains;

  return result;
}

// Converted to async to support dynamic imports for migration
// Uses requestIdleCallback for JSON parsing to improve TTI
export async function loadSelections(): Promise<UserSelections> {
  if (typeof window === 'undefined') return emptySelections;

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      // Use async parsing to avoid blocking the main thread during hydration
      // This improves Time To Interactive (TTI) for large datasets
      let parsed = await parseJsonAsync<Record<string, Selection[]>>(saved);

      let needsSave = false;

      // Async migrations
      if (parsed.stadiums) {
        parsed = await migrateStadiumSelections(parsed);
        needsSave = true;
      }

      if (parsed.mountains) {
        parsed = await migrateMountainSelections(parsed);
        needsSave = true;
      }

      // Clean up items deleted more than 30 days ago to prevent storage bloat
      const cleanup = cleanupOldDeletedItems(parsed);
      if (cleanup.cleaned) {
        parsed = cleanup.data;
        needsSave = true;
      }

      // Save migrated/cleaned data back to localStorage (async stringify)
      if (needsSave) {
        const jsonString = await stringifyJsonAsync(parsed);
        localStorage.setItem(STORAGE_KEY, jsonString);
      }

      // Merge with emptySelections to ensure all categories exist
      return {
        ...emptySelections,
        ...parsed,
      };
    }
  } catch (e) {
    console.error('Failed to load selections:', e);
  }
  return emptySelections;
}

export function saveSelections(selections: UserSelections): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selections));
    // Dispatch event so components can react to changes (e.g., achievement toasts)
    window.dispatchEvent(new Event('selections-updated'));
  } catch (e) {
    console.error('Failed to save selections:', e);
  }
}

export function toggleSelection(
  selections: UserSelections,
  category: Category,
  id: string,
  currentStatus: Status
): UserSelections {
  const categorySelections = [...(selections[category] || [])];
  const existingIndex = categorySelections.findIndex(s => s.id === id);

  // Cycle: unvisited -> visited -> bucketList -> unvisited
  let newStatus: Status | null = null;

  if (currentStatus === 'unvisited') {
    newStatus = 'visited';
  } else if (currentStatus === 'visited') {
    newStatus = 'bucketList';
  } else {
    newStatus = null; // Remove
  }

  const now = Date.now();

  if (newStatus === null) {
    // Soft-delete the selection (mark as deleted with timestamp)
    if (existingIndex !== -1) {
      categorySelections[existingIndex] = {
        id,
        status: 'unvisited',
        updatedAt: now,
        deleted: true,
      };
    }
  } else {
    // Add or update with timestamp
    if (existingIndex !== -1) {
      categorySelections[existingIndex] = { id, status: newStatus, updatedAt: now, deleted: false };
    } else {
      categorySelections.push({ id, status: newStatus, updatedAt: now, deleted: false });
    }
  }

  return {
    ...selections,
    [category]: categorySelections,
  };
}

export function setSelectionStatus(
  selections: UserSelections,
  category: Category,
  id: string,
  status: Status | null,
  visitedDate?: string,
  notes?: string
): UserSelections {
  const categorySelections = [...(selections[category] || [])];
  const existingIndex = categorySelections.findIndex(s => s.id === id);
  const now = Date.now();

  if (status === null) {
    // Soft-delete the selection (mark as deleted with timestamp)
    if (existingIndex !== -1) {
      categorySelections[existingIndex] = {
        id,
        status: 'unvisited',
        updatedAt: now,
        deleted: true,
      };
    }
  } else {
    // Add or update with timestamp
    // Preserve existing data if new data isn't provided
    const existingItem = existingIndex !== -1 ? categorySelections[existingIndex] : null;
    const newItem = {
      id,
      status,
      updatedAt: now,
      deleted: false,
      visitedDate: visitedDate !== undefined ? visitedDate : existingItem?.visitedDate,
      notes: notes !== undefined ? notes : existingItem?.notes,
    };

    if (existingIndex !== -1) {
      categorySelections[existingIndex] = newItem;
    } else {
      categorySelections.push(newItem);
    }
  }

  return {
    ...selections,
    [category]: categorySelections,
  };
}

export function getSelectionStatus(
  selections: UserSelections,
  category: Category,
  id: string
): Status {
  const categorySelections = selections[category] || [];
  const selection = categorySelections.find(s => s.id === id);
  // Return unvisited if selection is deleted or doesn't exist
  if (!selection || selection.deleted) return 'unvisited';
  return selection.status;
}

export function getStats(selections: UserSelections, category: Category, total: number) {
  const categorySelections = selections[category] || [];
  // Filter out deleted items when calculating stats
  const activeSelections = categorySelections.filter(s => !s.deleted);
  const visited = activeSelections.filter(s => s.status === 'visited').length;
  const bucketList = activeSelections.filter(s => s.status === 'bucketList').length;
  const percentage = total > 0 ? Math.round((visited / total) * 100) : 0;

  return { visited, bucketList, total, percentage };
}

export function clearAllSelections(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Apply cross-category relationships when a city is marked as visited.
 * - US cities: also marks the corresponding US state as visited
 * - World cities: also marks the corresponding country as visited
 *
 * Only applies when status is 'visited' (not for bucketList or unvisited).
 * Does not override existing selections - only adds if not already set.
 *
 * Updated to use preloaded maps safely - if data hasn't been loaded via
 * preloadCityData, this function will skip automation to prevent errors.
 */
export function applyCityRelatedSelections(
  selections: UserSelections,
  category: Category,
  cityId: string,
  status: Status | null
): UserSelections {
  // Only apply cross-checks for visited status
  if (status !== 'visited') return selections;

  // If data hasn't been loaded via preloadCityData, skip this automation to prevent errors
  if (!usCityToState || !worldCityToCountry || !worldCityToState || !availableCountryCodes) {
    return selections;
  }

  let result = { ...selections };
  const now = Date.now();

  const addOrUpdateVisited = (selCategory: Category, itemId: string) => {
    const list = [...(result[selCategory] || [])];
    const idx = list.findIndex(s => s.id === itemId);
    const existing = list[idx];

    // Only add if not already visited (don't override bucketList or existing visited)
    if (!existing || existing.deleted) {
      const newItem = { id: itemId, status: 'visited' as Status, updatedAt: now, deleted: false };
      if (existing) {
        list[idx] = newItem;
      } else {
        list.push(newItem);
      }
      result = { ...result, [selCategory]: list };
    }
  };

  if (category === 'usCities') {
    // Get the state code for this US city
    const stateCode = usCityToState.get(cityId);
    if (stateCode) {
      addOrUpdateVisited('states', stateCode);
    }
  } else if (category === 'worldCities') {
    // Get the country code for this world city
    const countryCode = worldCityToCountry.get(cityId);
    if (countryCode && availableCountryCodes.has(countryCode)) {
      addOrUpdateVisited('countries', countryCode);
    }

    // For US cities in worldCities, also mark the US state
    const stateCode = worldCityToState.get(cityId);
    if (stateCode) {
      addOrUpdateVisited('states', stateCode);
    }
  }

  return result;
}
