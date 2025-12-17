'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Category, Status, UserSelections, emptySelections, Selection } from '@/lib/types';
import { loadSelections, saveSelectionsAsync, toggleSelection, setSelectionStatus, getStats } from '@/lib/storage';
import { useAuth } from '@/lib/hooks/useAuth';
import { useCloudSync } from '@/lib/hooks/useCloudSync';
import SelectionList from '@/components/SelectionList';

interface Item {
  id: string;
  name: string;
  state: string;
  region?: string;
}

interface InteractiveStateListProps {
  items: Item[];
  category: Category;
  title: string;
}

/**
 * Interactive list component for state drill-down pages.
 * Handles selection state with localStorage and cloud sync.
 */
export default function InteractiveStateList({ items, category, title }: InteractiveStateListProps) {
  const [selections, setSelections] = useState<UserSelections>(emptySelections);
  const [isLoaded, setIsLoaded] = useState(false);
  const { user } = useAuth();

  // Cloud sync hook - handles all sync logic
  const { isSyncing } = useCloudSync({
    user,
    selections,
    setSelections,
    isLoaded,
  });

  // Load selections from localStorage on mount
  useEffect(() => {
    loadSelections().then(saved => {
      setSelections(saved);
      setIsLoaded(true);
    });
  }, []);

  // Save selections whenever they change
  useEffect(() => {
    if (!isLoaded) return;
    const timeout = setTimeout(async () => {
      await saveSelectionsAsync(selections);
    }, 500);
    return () => clearTimeout(timeout);
  }, [selections, isLoaded]);

  // Get selection list for this category
  const categorySelections = useMemo(() => {
    return selections[category] || [];
  }, [selections, category]);

  // Get status for an item
  const getStatus = useCallback((id: string): Status => {
    const selection = categorySelections.find(s => s.id === id);
    return selection?.status || 'unvisited';
  }, [categorySelections]);

  // Get visited date for an item
  const getVisitedDate = useCallback((id: string): string | undefined => {
    const selection = categorySelections.find(s => s.id === id);
    return selection?.visitedDate;
  }, [categorySelections]);

  // Get notes for an item
  const getNotes = useCallback((id: string): string | undefined => {
    const selection = categorySelections.find(s => s.id === id);
    return selection?.notes;
  }, [categorySelections]);

  // Toggle item status (unvisited -> visited -> bucketList -> unvisited)
  const handleToggle = useCallback((id: string, currentStatus: Status) => {
    setSelections(prev => toggleSelection(prev, category, id, currentStatus));
  }, [category]);

  // Set specific status for an item
  const handleSetStatus = useCallback((id: string, status: Status | null, visitedDate?: string, notes?: string) => {
    setSelections(prev => setSelectionStatus(prev, category, id, status, visitedDate, notes));
  }, [category]);

  // Clear all selections for this category (filtered to current items)
  const handleClearAll = useCallback(() => {
    const itemIds = new Set(items.map(i => i.id));
    setSelections(prev => ({
      ...prev,
      [category]: (prev[category] || []).filter(s => !itemIds.has(s.id))
    }));
  }, [category, items]);

  // Calculate stats for the items on this page
  const stats = useMemo(() => {
    const itemIds = new Set(items.map(i => i.id));
    let visited = 0;
    let bucketList = 0;

    categorySelections.forEach(selection => {
      if (itemIds.has(selection.id)) {
        if (selection.status === 'visited') visited++;
        else if (selection.status === 'bucketList') bucketList++;
      }
    });

    const total = items.length;
    const percentage = total > 0 ? Math.round((visited / total) * 100) : 0;

    return { visited, bucketList, total, percentage };
  }, [items, categorySelections]);

  // Format items for SelectionList
  const formattedItems = useMemo(() => {
    return items.map(item => ({
      id: item.id,
      name: item.name,
      group: item.region || item.state,
    }));
  }, [items]);

  if (!isLoaded) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-20 bg-muted rounded-lg" />
        <div className="grid gap-3 md:grid-cols-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-12 bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <SelectionList
      items={formattedItems}
      getStatus={getStatus}
      getVisitedDate={getVisitedDate}
      getNotes={getNotes}
      onToggle={handleToggle}
      onSetStatus={handleSetStatus}
      onClearAll={handleClearAll}
      groupBy="group"
      showSearch={items.length > 10}
      title={title}
      stats={stats}
      category={category}
      isAuthenticated={!!user}
      isLoading={isSyncing}
    />
  );
}
