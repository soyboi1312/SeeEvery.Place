import { UserSelections, emptySelections, Selection, Status, Category } from './types';
import { stadiums } from '@/data/stadiums';
import { mountains } from '@/data/mountains';

const STORAGE_KEY = 'travelmap_selections';

// Map sport names from stadium data to category keys
const sportToCategoryMap: Record<string, keyof UserSelections> = {
  'Baseball': 'mlbStadiums',
  'American Football': 'nflStadiums',
  'Basketball': 'nbaStadiums',
  'Hockey': 'nhlStadiums',
  'Football': 'soccerStadiums',
  'Cricket': 'soccerStadiums',  // Group cricket, rugby, tennis, motorsport with soccer for simplicity
  'Rugby': 'soccerStadiums',
  'Tennis': 'soccerStadiums',
  'Motorsport': 'soccerStadiums',
};

// Migrate old "stadiums" selections to new sport-specific categories
function migrateStadiumSelections(parsed: Record<string, Selection[]>): Record<string, Selection[]> {
  if (!parsed.stadiums || parsed.stadiums.length === 0) {
    return parsed;
  }

  const result = { ...parsed };
  const oldStadiumSelections = parsed.stadiums;

  // Create a map of stadium IDs to their sports
  const stadiumSportMap = new Map<string, string>();
  stadiums.forEach(s => stadiumSportMap.set(s.id, s.sport));

  // Distribute old stadium selections to new categories
  oldStadiumSelections.forEach((selection: Selection) => {
    const sport = stadiumSportMap.get(selection.id);
    if (sport) {
      const categoryKey = sportToCategoryMap[sport];
      if (categoryKey) {
        if (!result[categoryKey]) {
          result[categoryKey] = [];
        }
        // Check if already exists
        const exists = result[categoryKey].some((s: Selection) => s.id === selection.id);
        if (!exists) {
          result[categoryKey].push(selection);
        }
      }
    }
  });

  // Remove old stadiums key
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

      // Migrate old stadium selections to new sport-specific categories
      let needsSave = false;
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
  const percentage = Math.round((visited / total) * 100);

  return { visited, bucketList, total, percentage };
}

export function clearAllSelections(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
