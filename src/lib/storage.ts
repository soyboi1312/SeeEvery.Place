import { UserSelections, emptySelections, Selection, Status, Category } from './types';
import { mountains } from '@/data/mountains';
import { stadiums } from '@/data/stadiums';

const STORAGE_KEY = 'travelmap_selections';

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

      // Save migrated data back to localStorage
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

  if (newStatus === null) {
    // Remove the selection
    if (existingIndex !== -1) {
      categorySelections.splice(existingIndex, 1);
    }
  } else {
    // Add or update
    if (existingIndex !== -1) {
      categorySelections[existingIndex] = { id, status: newStatus };
    } else {
      categorySelections.push({ id, status: newStatus });
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

  if (status === null) {
    // Remove the selection
    if (existingIndex !== -1) {
      categorySelections.splice(existingIndex, 1);
    }
  } else {
    // Add or update
    if (existingIndex !== -1) {
      categorySelections[existingIndex] = { id, status };
    } else {
      categorySelections.push({ id, status });
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
  return selection?.status || 'unvisited';
}

export function getStats(selections: UserSelections, category: Category, total: number) {
  const categorySelections = selections[category] || [];
  const visited = categorySelections.filter(s => s.status === 'visited').length;
  const bucketList = categorySelections.filter(s => s.status === 'bucketList').length;
  const percentage = total > 0 ? Math.round((visited / total) * 100) : 0;

  return { visited, bucketList, total, percentage };
}

export function clearAllSelections(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
