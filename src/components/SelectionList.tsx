'use client';

import { useState, useMemo, useRef, useCallback, memo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Status, Category } from '@/lib/types';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { Search, Check, Star, Circle, Trash2, X, AlertCircle, Calendar as CalendarIcon, StickyNote, Lock, Info, Pencil, MapPin, Plus } from 'lucide-react';
import dynamic from 'next/dynamic';

// Lazy load the AddToTripModal to avoid initial bundle bloat
const AddToTripModal = dynamic(
  () => import('@/components/itineraries/AddToTripModal'),
  { ssr: false }
);

// Shadcn Imports
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from '@/components/ui/context-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Item {
  id: string;
  name: string;
  group?: string;
  code?: string;
  aliases?: string[];
  unescoId?: number;
}

interface SelectionListProps {
  items: Item[];
  getStatus: (id: string) => Status;
  getVisitedDate?: (id: string) => string | undefined;
  getNotes?: (id: string) => string | undefined;
  onToggle: (id: string, currentStatus: Status) => void;
  onSetStatus: (id: string, status: Status | null, visitedDate?: string, notes?: string) => void;
  onClearAll?: () => void;
  groupBy?: 'group' | 'none';
  showSearch?: boolean;
  title: string;
  stats: { visited: number; bucketList: number; total: number; percentage: number };
  category?: Category;
  isAuthenticated?: boolean;
  isLoading?: boolean;
}

// Empty state content by category
const emptyStateContent: Record<Category, { icon: string; title: string; subtitle: string }> = {
  countries: {
    icon: '🌍',
    title: 'Your World Map Awaits',
    subtitle: 'Tap any country on the map to mark it as visited and watch your journey unfold!',
  },
  states: {
    icon: '🇺🇸',
    title: 'Start Your American Adventure',
    subtitle: 'Click a state to mark it visited. Road trip across all 50 states!',
  },
  territories: {
    icon: '🏝️',
    title: 'Explore US Territories',
    subtitle: 'From Puerto Rico to Guam - discover America beyond the 50 states!',
  },
  usCities: {
    icon: '🏙️',
    title: 'Explore American Cities',
    subtitle: 'From New York to Los Angeles - track the major cities you\'ve visited!',
  },
  worldCities: {
    icon: '🌆',
    title: 'Discover World Cities',
    subtitle: 'From Tokyo to Paris - build your global city bucket list!',
  },
  nationalParks: {
    icon: '🏞️',
    title: 'Explore Nature\'s Wonders',
    subtitle: 'From Yellowstone to Yosemite - mark the parks you\'ve explored!',
  },
  nationalMonuments: {
    icon: '🗽',
    title: 'Monument Explorer',
    subtitle: 'From Devils Tower to the Statue of Liberty - discover America\'s protected landmarks!',
  },
  stateParks: {
    icon: '🌲',
    title: 'Discover Hidden Gems',
    subtitle: 'State parks offer incredible beauty. Start tracking your visits!',
  },
  fiveKPeaks: {
    icon: '🏔️',
    title: 'Conquer the Giants',
    subtitle: 'Track the world\'s highest peaks including the mighty 8000ers!',
  },
  fourteeners: {
    icon: '⛰️',
    title: 'Summit the 14ers',
    subtitle: 'Colorado\'s iconic peaks await. How many have you conquered?',
  },
  museums: {
    icon: '🎨',
    title: 'Culture Awaits',
    subtitle: 'From the Louvre to the Met - track your museum adventures!',
  },
  mlbStadiums: {
    icon: '⚾',
    title: 'Play Ball!',
    subtitle: 'Visit every MLB ballpark. Fenway to Dodger Stadium awaits!',
  },
  nflStadiums: {
    icon: '🏈',
    title: 'Gridiron Glory',
    subtitle: 'Experience the roar of NFL stadiums across America!',
  },
  nbaStadiums: {
    icon: '🏀',
    title: 'Nothing But Net',
    subtitle: 'From MSG to Crypto.com Arena - every court has a story!',
  },
  nhlStadiums: {
    icon: '🏒',
    title: 'Hit the Ice',
    subtitle: 'Track your visits to NHL arenas across North America!',
  },
  soccerStadiums: {
    icon: '⚽',
    title: 'The Beautiful Game',
    subtitle: 'Camp Nou, Old Trafford, Maracanã - legendary pitches await!',
  },
  f1Tracks: {
    icon: '🏎️',
    title: 'Start Your Engines',
    subtitle: 'Monaco, Silverstone, Monza - experience F1 circuits worldwide!',
  },
  marathons: {
    icon: '🏃',
    title: 'Chase the Majors',
    subtitle: 'Track the World Marathon Majors. 42.195km of glory awaits!',
  },
  airports: {
    icon: '✈️',
    title: 'Jet Set Journey',
    subtitle: 'From JFK to Changi - track the world\'s greatest airports!',
  },
  skiResorts: {
    icon: '⛷️',
    title: 'Powder Paradise',
    subtitle: 'Whistler, Zermatt, Niseko - chase the perfect run worldwide!',
  },
  themeParks: {
    icon: '🎢',
    title: 'Thrill Seeker',
    subtitle: 'Disney, Universal, Europa-Park - where dreams come true!',
  },
  surfingReserves: {
    icon: '🌊',
    title: 'Ride the Wave',
    subtitle: 'Pipeline, Malibu, Teahupo\'o - legendary breaks await!',
  },
  weirdAmericana: {
    icon: '🗿',
    title: 'Discover Weird America',
    subtitle: 'Giant twine balls, mystery spots, UFO museums - embrace the quirky!',
  },
  euroFootballStadiums: {
    icon: '⚽',
    title: 'European Football',
    subtitle: 'From the Premier League to La Liga - visit the greatest grounds in Europe!',
  },
  rugbyStadiums: {
    icon: '🏉',
    title: 'Rugby Grounds',
    subtitle: 'Twickenham, Millennium Stadium, Eden Park - experience rugby worldwide!',
  },
  cricketStadiums: {
    icon: '🏏',
    title: 'Cricket Grounds',
    subtitle: 'Lord\'s, the MCG, Eden Gardens - track the world\'s great cricket venues!',
  },
};

export default function SelectionList({
  items,
  getStatus,
  getVisitedDate,
  getNotes,
  onToggle,
  onSetStatus,
  onClearAll,
  groupBy = 'group',
  showSearch = true,
  title,
  stats,
  category,
  isAuthenticated = false,
  isLoading = false,
}: SelectionListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'visited' | 'bucketList' | 'unvisited'>('all');
  const [dateEditItem, setDateEditItem] = useState<{ id: string; name: string } | null>(null);
  const [noteEditItem, setNoteEditItem] = useState<{ id: string; name: string } | null>(null);
  const [tempNote, setTempNote] = useState('');

  // Info Dialog state
  const [infoItem, setInfoItem] = useState<{ id: string; name: string } | null>(null);
  const [descriptions, setDescriptions] = useState<Record<string, string> | null>(null);
  const [isLoadingInfo, setIsLoadingInfo] = useState(false);

  // Add to Quest modal state
  const [tripModalItem, setTripModalItem] = useState<{ id: string; name: string } | null>(null);

  // Debounce search query to prevent lag on large lists (300ms delay)
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Ref for virtualized list container
  const parentRef = useRef<HTMLDivElement>(null);

  const hasSelections = stats.visited > 0 || stats.bucketList > 0;

  const handleDateSave = (date: string) => {
    if (dateEditItem) {
      onSetStatus(dateEditItem.id, 'visited', date);
      setDateEditItem(null);
    }
  };

  const openNoteDialog = (id: string, name: string, currentNote?: string) => {
    setTempNote(currentNote || '');
    setNoteEditItem({ id, name });
  };

  const handleNoteSave = () => {
    if (noteEditItem) {
      // Pass undefined for date to preserve it, pass the note
      onSetStatus(noteEditItem.id, 'visited', undefined, tempNote);
      setNoteEditItem(null);
    }
  };

  // Handler to fetch descriptions (lazy loaded) and show info dialog
  const handleShowInfo = async (id: string, name: string) => {
    setInfoItem({ id, name });

    // Only fetch if we haven't already
    if (!descriptions) {
      setIsLoadingInfo(true);
      try {
        const res = await fetch('/data/descriptions.json');
        if (!res.ok) throw new Error('Failed to load info');
        const data = await res.json();
        setDescriptions(data);
      } catch (error) {
        console.error("Could not load descriptions", error);
        setDescriptions({});
      } finally {
        setIsLoadingInfo(false);
      }
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Use debounced search query to prevent filtering on every keystroke
      const query = debouncedSearchQuery.toLowerCase().trim();
      const matchesName = item.name.toLowerCase().includes(query);
      const matchesCode = item.code?.toLowerCase() === query;
      const matchesAlias = item.aliases?.some(alias => alias.toLowerCase() === query);
      const matchesSearch = matchesName || matchesCode || matchesAlias;
      const status = getStatus(item.id);
      const matchesFilter = filterMode === 'all' || status === filterMode;
      return matchesSearch && matchesFilter;
    });
  }, [items, debouncedSearchQuery, filterMode, getStatus]);

  const groupedItems = useMemo(() => {
    if (groupBy === 'none') {
      return { 'All': filteredItems };
    }

    const groups: Record<string, Item[]> = {};
    filteredItems.forEach(item => {
      const group = item.group || 'Other';
      if (!groups[group]) groups[group] = [];
      groups[group].push(item);
    });
    return groups;
  }, [filteredItems, groupBy]);

  // Flatten grouped items for virtualization
  // Each row is either a group header or an item
  type VirtualRow = { type: 'header'; group: string; count: number } | { type: 'item'; item: Item };

  const virtualRows = useMemo<VirtualRow[]>(() => {
    const rows: VirtualRow[] = [];
    Object.entries(groupedItems).forEach(([group, groupItems]) => {
      if (groupBy !== 'none') {
        rows.push({ type: 'header', group, count: groupItems.length });
      }
      groupItems.forEach(item => {
        rows.push({ type: 'item', item });
      });
    });
    return rows;
  }, [groupedItems, groupBy]);

  // Use virtualization only when list is very large (>500 items)
  // This keeps multi-column grid for most categories while still virtualizing huge lists like worldCities
  const shouldVirtualize = filteredItems.length > 500;

  const rowVirtualizer = useVirtualizer({
    count: virtualRows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: useCallback((index: number) => {
      const row = virtualRows[index];
      // Headers are smaller than items
      return row?.type === 'header' ? 40 : 52;
    }, [virtualRows]),
    overscan: 10, // Render 10 extra items outside viewport for smooth scrolling
  });

  return (
    <Card className="border-0 shadow-lg overflow-hidden flex flex-col h-full bg-background">
      {/* Header with Gradient */}
      <div className="px-6 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white shrink-0">
        <div className="flex justify-between items-start">
          <h2 className="text-2xl font-bold mb-3 tracking-tight">{title}</h2>
        </div>

        <div className="flex flex-wrap gap-3 text-sm font-medium">
          <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0 gap-1.5 backdrop-blur-sm">
            <Check className="w-3.5 h-3.5" />
            {stats.visited} visited ({stats.percentage}%)
          </Badge>
          <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0 gap-1.5 backdrop-blur-sm">
            <Star className="w-3.5 h-3.5" />
            {stats.bucketList} bucket list
          </Badge>
          <span className="text-white/80 self-center text-xs ml-1">
            {stats.total} total
          </span>
        </div>
      </div>

      {/* Controls Area */}
      <div className="p-4 border-b bg-muted/30 space-y-4 shrink-0">
        {showSearch && (
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or abbreviation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background"
            />
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
          {/* Filters */}
          <div className="flex gap-1.5 p-1 bg-muted rounded-lg w-full sm:w-auto overflow-x-auto no-scrollbar">
            {(['all', 'visited', 'bucketList', 'unvisited'] as const).map((mode) => (
              <Button
                key={mode}
                variant={filterMode === mode ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilterMode(mode)}
                className={`rounded-md px-3 h-8 text-xs font-medium whitespace-nowrap ${
                  filterMode === mode ? 'shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {mode === 'all' && 'All'}
                {mode === 'visited' && <><Check className="w-3 h-3 mr-1" /> Visited</>}
                {mode === 'bucketList' && <><Star className="w-3 h-3 mr-1" /> Bucket List</>}
                {mode === 'unvisited' && 'Not Yet'}
              </Button>
            ))}
          </div>

          {/* Clear All Button */}
          {onClearAll && hasSelections && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 h-8">
                  <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                  Clear
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear all selections?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will remove all {stats.visited} visited and {stats.bucketList} bucket list items from {title}.
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onClearAll} className="bg-red-600 hover:bg-red-700">
                    Clear All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      {/* Main List Area */}
      <div
        ref={parentRef}
        className="flex-1 overflow-y-auto max-h-[60vh] sm:max-h-[500px]"
      >
        {/* Loading skeleton when switching categories */}
        {isLoading ? (
          <div className="p-4 space-y-3 animate-pulse">
            <div className="h-6 bg-muted rounded w-24 mb-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="h-11 bg-muted rounded-lg" />
              ))}
            </div>
          </div>
        ) : shouldVirtualize && filteredItems.length > 0 ? (
          <div
            className="p-4 relative"
            style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const row = virtualRows[virtualRow.index];
              if (!row) return null;

              if (row.type === 'header') {
                return (
                  <div
                    key={`header-${row.group}`}
                    className="absolute top-0 left-0 right-0 px-4"
                    style={{
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    <div className="flex items-center gap-2 h-full">
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {row.group}
                      </h3>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                        {row.count}
                      </span>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={row.item.id}
                  className="absolute top-0 left-0 right-0 px-4"
                  style={{
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <div className="h-full flex items-center">
                    <ItemCard
                      item={row.item}
                      status={getStatus(row.item.id)}
                      visitedDate={getVisitedDate?.(row.item.id)}
                      notes={getNotes?.(row.item.id)}
                      onToggle={onToggle}
                      onSetStatus={onSetStatus}
                      onEditDate={() => setDateEditItem({ id: row.item.id, name: row.item.name })}
                      onEditNote={(currentNote) => openNoteDialog(row.item.id, row.item.name, currentNote)}
                      isAuthenticated={isAuthenticated}
                      onShowInfo={() => handleShowInfo(row.item.id, row.item.name)}
                      onAddToTrip={() => setTripModalItem({ id: row.item.id, name: row.item.name })}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Non-virtualized list for small datasets (better UX for small lists) */
          <div className="p-4">
            {Object.entries(groupedItems).map(([group, groupItems]) => (
              <div key={group} className="mb-6 last:mb-0">
                {groupBy !== 'none' && (
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {group}
                    </h3>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                      {groupItems.length}
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {groupItems.map(item => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      status={getStatus(item.id)}
                      visitedDate={getVisitedDate?.(item.id)}
                      notes={getNotes?.(item.id)}
                      onToggle={onToggle}
                      onSetStatus={onSetStatus}
                      onEditDate={() => setDateEditItem({ id: item.id, name: item.name })}
                      onEditNote={(currentNote) => openNoteDialog(item.id, item.name, currentNote)}
                      isAuthenticated={isAuthenticated}
                      onShowInfo={() => handleShowInfo(item.id, item.name)}
                      onAddToTrip={() => setTripModalItem({ id: item.id, name: item.name })}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty States */}
        {filteredItems.length === 0 && (
            <div className="py-12 flex flex-col items-center text-center px-4 animate-in fade-in duration-300">
              {searchQuery ? (
                <>
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                    <Search className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">No items found matching &quot;{searchQuery}&quot;</p>
                </>
              ) : filterMode !== 'all' ? (
                <>
                  <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4 text-3xl">
                    {filterMode === 'visited' ? '✓' : filterMode === 'bucketList' ? '★' : '○'}
                  </div>
                  <h3 className="font-semibold text-lg mb-1">It's quiet here...</h3>
                  <p className="text-sm text-muted-foreground">
                    {filterMode === 'visited' && 'No visited items yet. Start checking things off!'}
                    {filterMode === 'bucketList' && 'Your bucket list is empty. Time to dream big!'}
                    {filterMode === 'unvisited' && 'Wow! You\'ve tracked everything in this list!'}
                  </p>
                </>
              ) : category && emptyStateContent[category] ? (
                <>
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 flex items-center justify-center mb-4 text-4xl shadow-sm">
                    {emptyStateContent[category].icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{emptyStateContent[category].title}</h3>
                  <p className="text-muted-foreground max-w-sm mb-6">
                    {emptyStateContent[category].subtitle}
                  </p>
                  <div className="flex flex-wrap justify-center gap-4 text-xs font-medium text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                      Tap to Visit
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      Right-click for Options
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Plus className="w-3 h-3 text-purple-500" />
                      Add to Quest
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          )}
      </div>

      {/* Date Selection Dialog */}
      <Dialog open={!!dateEditItem} onOpenChange={(open) => !open && setDateEditItem(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>When did you visit{dateEditItem ? ` ${dateEditItem.name}` : ''}?</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="visit-date">Date Visited</Label>
              <Input
                id="visit-date"
                type="date"
                className="w-full"
                defaultValue={dateEditItem ? getVisitedDate?.(dateEditItem.id) : undefined}
                max={new Date().toISOString().split('T')[0]}
                onChange={(e) => {
                  if (e.target.value) {
                    handleDateSave(e.target.value);
                  }
                }}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Select a date to mark this location as visited.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Note Dialog */}
      <Dialog open={!!noteEditItem} onOpenChange={(open) => !open && setNoteEditItem(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Personal Notes{noteEditItem ? ` - ${noteEditItem.name}` : ''}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="note">Your Memory (max 280 chars)</Label>
              <Textarea
                id="note"
                value={tempNote}
                onChange={(e) => setTempNote(e.target.value)}
                placeholder="Best ramen shop was nearby..."
                maxLength={280}
                className="resize-none h-32"
              />
              <div className="text-xs text-muted-foreground text-right">
                {tempNote.length}/280
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleNoteSave}>Save Note</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Info Dialog */}
      <Dialog open={!!infoItem} onOpenChange={(open) => !open && setInfoItem(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-500" />
              {infoItem?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 text-sm leading-relaxed text-muted-foreground">
            {isLoadingInfo ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              descriptions?.[infoItem?.id || ''] || "No description available for this location yet. Go explore and write your own story!"
            )}

            {/* UNESCO Attribution - Required for compliance */}
            {items.find(i => i.id === infoItem?.id)?.unescoId && (
              <div className="mt-6 pt-4 border-t border-border/50 text-xs">
                <p className="font-semibold text-foreground mb-1">Source & Attribution</p>
                <p className="mb-2">
                  <a
                    href={`https://whc.unesco.org/en/list/${items.find(i => i.id === infoItem?.id)?.unescoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    View official UNESCO listing
                    <span className="inline-block">↗</span>
                  </a>
                </p>
                <p className="text-[10px] opacity-70">
                  Copyright © 1992 - {new Date().getFullYear()} UNESCO/World Heritage Centre. All rights reserved.
                </p>
              </div>
            )}
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="secondary"
              onClick={() => window.open(`https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(infoItem?.name || '')}`, '_blank')}
            >
              Read More on Wiki
            </Button>
            <Button onClick={() => setInfoItem(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add to Quest Modal */}
      {tripModalItem && category && (
        <AddToTripModal
          isOpen={!!tripModalItem}
          onClose={() => setTripModalItem(null)}
          category={category}
          placeId={tripModalItem.id}
          placeName={tripModalItem.name}
        />
      )}
    </Card>
  );
}

interface ItemCardProps {
  item: Item;
  status: Status;
  visitedDate?: string;
  notes?: string;
  onToggle: (id: string, currentStatus: Status) => void;
  onSetStatus: (id: string, status: Status | null, visitedDate?: string, notes?: string) => void;
  onEditDate: () => void;
  onEditNote: (currentNote?: string) => void;
  isAuthenticated?: boolean;
  onShowInfo: () => void;
  onAddToTrip: () => void;
}

// Memoized ItemCard to prevent unnecessary re-renders during virtualization
const ItemCard = memo(function ItemCard({ item, status, visitedDate, notes, onToggle, onSetStatus, onEditDate, onEditNote, isAuthenticated, onShowInfo, onAddToTrip }: ItemCardProps) {
  // Styles based on status
  const getStyles = (s: Status) => {
    switch (s) {
      case 'visited':
        return 'bg-green-100 dark:bg-green-900/30 border-green-500/30 text-green-900 dark:text-green-100 hover:bg-green-200 dark:hover:bg-green-900/50';
      case 'bucketList':
        return 'bg-amber-100 dark:bg-amber-900/30 border-amber-500/30 text-amber-900 dark:text-amber-100 hover:bg-amber-200 dark:hover:bg-amber-900/50';
      default:
        return 'bg-card hover:bg-accent/50 border-transparent hover:border-border text-foreground';
    }
  };

  const getIcon = (s: Status) => {
    switch (s) {
      case 'visited': return <Check className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case 'bucketList': return <Star className="w-4 h-4 text-amber-600 dark:text-amber-400 fill-current" />;
      default: return <Circle className="w-4 h-4 text-muted-foreground/30" />;
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="flex items-center gap-1 group/row w-full">
          <Button
            variant="outline"
            className={`flex-1 justify-start h-11 px-3 transition-all duration-200 border relative group ${getStyles(status)}`}
            onClick={() => onToggle(item.id, status)}
          >
            <div className="flex items-center gap-3 w-full overflow-hidden">
              <span className="shrink-0 flex items-center justify-center">
                {getIcon(status)}
              </span>
              <span className="truncate font-medium">{item.name}</span>
              {/* Year badge when visited with a date */}
              {visitedDate && status === 'visited' && (
                <span className="text-[10px] bg-green-200/50 dark:bg-green-800/50 px-1.5 py-0.5 rounded-sm shrink-0">
                  {visitedDate.split('-')[0]}
                </span>
              )}
              {/* Note indicator */}
              {notes && (
                <StickyNote className="w-3 h-3 text-indigo-500 fill-indigo-500/20 shrink-0" />
              )}
              {item.code && (
                <span className="ml-auto text-xs opacity-50 font-mono hidden sm:inline-block shrink-0">
                  {item.code}
                </span>
              )}
            </div>
          </Button>
          {/* Add to Quest Button - Visible on hover for quick access */}
          {isAuthenticated && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 text-purple-500 hover:text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/30 opacity-0 group-hover/row:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                onAddToTrip();
              }}
              title="Add to Quest"
            >
              <Plus className="w-4 h-4" />
            </Button>
          )}

          {/* Info Button - Placed outside main button to avoid toggling status */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 text-muted-foreground/50 hover:text-blue-500 opacity-50 group-hover/row:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              onShowInfo();
            }}
          >
            <Info className="w-4 h-4" />
          </Button>

          {/* Edit Menu (Pencil) - Mobile-friendly alternative to right-click */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 text-muted-foreground/50 hover:text-indigo-500 opacity-50 group-hover/row:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                <Pencil className="w-3.5 h-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isAuthenticated ? (
                <>
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    onEditDate();
                  }}>
                    <CalendarIcon className="w-4 h-4 mr-2 text-blue-500" />
                    {visitedDate ? 'Change Date' : 'Mark Visited on Date...'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    onEditNote(notes);
                  }}>
                    <StickyNote className="w-4 h-4 mr-2 text-indigo-500" />
                    {notes ? 'Edit Note' : 'Add Note'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    onAddToTrip();
                  }}>
                    <MapPin className="w-4 h-4 mr-2 text-purple-500" />
                    Add to Trip
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem disabled>
                  <Lock className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span>Sign in to edit</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </ContextMenuTrigger>

      <ContextMenuContent className="w-48">
        <ContextMenuItem onClick={() => onSetStatus(item.id, 'visited')}>
          <Check className="w-4 h-4 mr-2 text-green-500" />
          Mark Visited
        </ContextMenuItem>
        {isAuthenticated ? (
          <>
            <ContextMenuItem onClick={onEditDate}>
              <CalendarIcon className="w-4 h-4 mr-2 text-blue-500" />
              {visitedDate ? 'Edit Visit Date' : 'Mark Visited on Date...'}
            </ContextMenuItem>
            <ContextMenuItem onClick={() => onEditNote(notes)}>
              <StickyNote className="w-4 h-4 mr-2 text-indigo-500" />
              {notes ? 'Edit Note' : 'Add Note'}
            </ContextMenuItem>
            <ContextMenuItem onClick={onAddToTrip}>
              <MapPin className="w-4 h-4 mr-2 text-purple-500" />
              Add to Trip
            </ContextMenuItem>
          </>
        ) : (
          <ContextMenuItem disabled className="opacity-70 cursor-not-allowed">
            <Lock className="w-4 h-4 mr-2 text-muted-foreground" />
            <span className="text-muted-foreground">Sign in to add dates & notes</span>
          </ContextMenuItem>
        )}
        <ContextMenuItem onClick={() => onSetStatus(item.id, 'bucketList')}>
          <Star className="w-4 h-4 mr-2 text-amber-500" />
          Add to Bucket List
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={() => onSetStatus(item.id, null)}>
          <X className="w-4 h-4 mr-2" />
          Clear Status
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
});
