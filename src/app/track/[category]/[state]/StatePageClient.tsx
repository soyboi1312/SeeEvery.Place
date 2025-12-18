'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Category, Status, UserSelections, emptySelections } from '@/lib/types';
import { loadSelections, saveSelectionsAsync, toggleSelection, setSelectionStatus } from '@/lib/storage';
import { useAuth } from '@/lib/hooks/useAuth';
import { useCloudSync } from '@/lib/hooks/useCloudSync';
import SelectionList from '@/components/SelectionList';
import { US_MARKER_CONFIG, WORLD_MARKER_CONFIG } from '@/components/maps/mapConfigs';
import { RegionFilter } from '@/lib/markerUtils';

// Dynamic import for the map to avoid SSR issues
const CategoryMarkerMap = dynamic(() => import('@/components/maps/CategoryMarkerMap'), {
  ssr: false,
  loading: () => <div className="w-full aspect-[2/1] bg-muted animate-pulse rounded-2xl" />
});

interface Item {
  id: string;
  name: string;
  state: string;
  region?: string;
  countryCode?: string;
}

interface StatePageClientProps {
  items: Item[];
  category: Category;
  title: string;
  regionCode: string; // The state or country code
  isCountry?: boolean; // Whether this is a country or a state
}

/**
 * Interactive client component for state/country drill-down pages.
 * Combines a filtered map view with the interactive SelectionList.
 */
export default function StatePageClient({
  items,
  category,
  title,
  regionCode,
  isCountry = false
}: StatePageClientProps) {
  const [selections, setSelections] = useState<UserSelections>(emptySelections);
  const [isLoaded, setIsLoaded] = useState(false);
  const { user } = useAuth();

  // Cloud sync hook
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

  // Auto-save selections
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

  // Toggle item status
  const handleToggle = useCallback((id: string, currentStatus: Status) => {
    setSelections(prev => toggleSelection(prev, category, id, currentStatus));
  }, [category]);

  // Set specific status for an item
  const handleSetStatus = useCallback((id: string, status: Status | null, visitedDate?: string, notes?: string) => {
    setSelections(prev => setSelectionStatus(prev, category, id, status, visitedDate, notes));
  }, [category]);

  // Clear all selections for items on this page
  const handleClearAll = useCallback(() => {
    const itemIds = new Set(items.map(i => i.id));
    setSelections(prev => ({
      ...prev,
      [category]: (prev[category] || []).filter(s => !itemIds.has(s.id))
    }));
  }, [category, items]);

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

  // Map configuration
  const mapConfig = isCountry ? WORLD_MARKER_CONFIG : US_MARKER_CONFIG;
  const regionFilter: RegionFilter = isCountry
    ? { country: regionCode.toUpperCase() }
    : { state: regionCode.toUpperCase() };

  // Tooltip handlers for the map
  const tooltipHandlers = useMemo(() => ({
    onMouseEnter: () => {},
    onMouseLeave: () => {},
    onMouseMove: () => {},
  }), []);

  if (!isLoaded) {
    return (
      <div className="space-y-8">
        <div className="w-full aspect-[2/1] bg-muted animate-pulse rounded-2xl" />
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-muted rounded-lg" />
          <div className="grid gap-3 md:grid-cols-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Drill-down Map - Shows only markers in this region */}
      <div className="relative w-full rounded-2xl overflow-hidden border border-border shadow-lg bg-card/50">
        <div className="absolute top-3 right-3 z-10 bg-background/80 backdrop-blur px-3 py-1.5 rounded-full text-xs font-medium border border-border shadow-sm">
          Click markers to toggle status
        </div>

        <div className="w-full aspect-[2/1]">
          <CategoryMarkerMap
            category={category}
            selections={selections}
            onToggle={handleToggle}
            tooltip={tooltipHandlers}
            items={formattedItems}
            config={mapConfig}
            regionFilter={regionFilter}
          />
        </div>

        {/* Map Legend */}
        <div className="flex justify-center gap-6 py-3 text-sm text-muted-foreground border-t border-border/50 bg-muted/30">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span>Visited</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
            <span>Bucket List</span>
          </div>
        </div>
      </div>

      {/* Interactive List View */}
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
    </div>
  );
}
