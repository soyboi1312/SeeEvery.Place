import { UserSelections, emptySelections, Selection, Status, Category } from './types';
import { mountains } from '@/data/mountains';
import { stadiums } from '@/data/stadiums';
import { usCities } from '@/data/usCities';
import { worldCities } from '@/data/worldCities';
import { countries } from '@/data/countries';

// Create lookup maps for city -> state/country relationships
const usCityToState = new Map(usCities.map(c => [c.id, c.stateCode]));
const worldCityToCountry = new Map(worldCities.map(c => [c.id, c.countryCode]));
// For US cities in worldCities, also track stateCode for cross-check
const worldCityToState = new Map(
  worldCities.filter(c => c.stateCode).map(c => [c.id, c.stateCode!])
);

const STORAGE_KEY = 'travelmap_selections';

// 365 days in milliseconds for cleanup of permanently deleted items
// Must match sync.ts DELETED_RETENTION_MS to prevent zombie items during cloud sync
const PERMANENT_DELETE_THRESHOLD_MS = 365 * 24 * 60 * 60 * 1000;

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

// Migrate merged stadiums category back to individual sport-specific categories
function migrateStadiumSelections(parsed: Record<string, Selection[]>): Record<string, Selection[]> {
  // Check if we have a merged stadiums category to split
  if (!parsed.stadiums || parsed.stadiums.length === 0) {
    return parsed;
  }

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

// Migrate old "mountains" selections to new fiveKPeaks and fourteeners categories
function migrateMountainSelections(parsed: Record<string, Selection[]>): Record<string, Selection[]> {
  if (!parsed.mountains || parsed.mountains.length === 0) {
    return parsed;
  }

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

export function loadSelections(): UserSelections {
  if (typeof window === 'undefined') return emptySelections;

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      let parsed = JSON.parse(saved);

      let needsSave = false;

      // Migrate merged stadiums back to individual categories
      if (parsed.stadiums) {
        parsed = migrateStadiumSelections(parsed);
        needsSave = true;
      }

      // Migrate old mountain selections to new fiveKPeaks and fourteeners categories
      if (parsed.mountains) {
        parsed = migrateMountainSelections(parsed);
        needsSave = true;
      }

      // Clean up items deleted more than 30 days ago to prevent storage bloat
      const cleanup = cleanupOldDeletedItems(parsed);
      if (cleanup.cleaned) {
        parsed = cleanup.data;
        needsSave = true;
      }

      // Save migrated/cleaned data back to localStorage
      if (needsSave) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
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
  status: Status | null
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
    if (existingIndex !== -1) {
      categorySelections[existingIndex] = { id, status, updatedAt: now, deleted: false };
    } else {
      categorySelections.push({ id, status, updatedAt: now, deleted: false });
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
 */
export function applyCityRelatedSelections(
  selections: UserSelections,
  category: Category,
  cityId: string,
  status: Status | null
): UserSelections {
  // Only apply cross-checks for visited status
  if (status !== 'visited') return selections;

  let result = { ...selections };
  const now = Date.now();

  if (category === 'usCities') {
    // Get the state code for this US city
    const stateCode = usCityToState.get(cityId);
    if (stateCode) {
      const stateSelections = [...(result.states || [])];
      const existing = stateSelections.find(s => s.id === stateCode);

      // Only add if not already visited (don't override bucketList or existing visited)
      if (!existing || existing.deleted) {
        if (existing) {
          // Update existing deleted selection
          const idx = stateSelections.findIndex(s => s.id === stateCode);
          stateSelections[idx] = { id: stateCode, status: 'visited', updatedAt: now, deleted: false };
        } else {
          stateSelections.push({ id: stateCode, status: 'visited', updatedAt: now, deleted: false });
        }
        result = { ...result, states: stateSelections };
      }
    }
  } else if (category === 'worldCities') {
    // Get the country code for this world city
    const countryCode = worldCityToCountry.get(cityId);
    if (countryCode) {
      // Verify this country exists in our countries list
      const countryExists = countries.some(c => c.code === countryCode);
      if (countryExists) {
        const countrySelections = [...(result.countries || [])];
        const existing = countrySelections.find(s => s.id === countryCode);

        // Only add if not already visited (don't override bucketList or existing visited)
        if (!existing || existing.deleted) {
          if (existing) {
            // Update existing deleted selection
            const idx = countrySelections.findIndex(s => s.id === countryCode);
            countrySelections[idx] = { id: countryCode, status: 'visited', updatedAt: now, deleted: false };
          } else {
            countrySelections.push({ id: countryCode, status: 'visited', updatedAt: now, deleted: false });
          }
          result = { ...result, countries: countrySelections };
        }
      }
    }

    // For US cities in worldCities, also mark the US state
    const stateCode = worldCityToState.get(cityId);
    if (stateCode) {
      const stateSelections = [...(result.states || [])];
      const existing = stateSelections.find(s => s.id === stateCode);

      // Only add if not already visited (don't override bucketList or existing visited)
      if (!existing || existing.deleted) {
        if (existing) {
          const idx = stateSelections.findIndex(s => s.id === stateCode);
          stateSelections[idx] = { id: stateCode, status: 'visited', updatedAt: now, deleted: false };
        } else {
          stateSelections.push({ id: stateCode, status: 'visited', updatedAt: now, deleted: false });
        }
        result = { ...result, states: stateSelections };
      }
    }
  }

  return result;
}
