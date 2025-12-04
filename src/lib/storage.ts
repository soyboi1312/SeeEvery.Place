import { UserSelections, emptySelections, Selection, Status, Category } from './types';

const STORAGE_KEY = 'travelmap_selections';

export function loadSelections(): UserSelections {
  if (typeof window === 'undefined') return emptySelections;

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
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
