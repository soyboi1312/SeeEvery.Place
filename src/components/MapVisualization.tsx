/**
 * src/components/MapVisualization.tsx
 * Main map visualization component that composes individual map types
 */
'use client';

import { useState, useCallback, useMemo, useEffect, useRef, memo } from 'react';
import { createPortal } from 'react-dom';
import dynamic from 'next/dynamic';
import { Category, Status } from '@/lib/types';
import {
  TooltipState,
  TooltipHandlers,
  MapVisualizationProps,
} from './maps';

// Loading placeholder for lazy-loaded map components
const MapLoadingPlaceholder = () => (
  <div className="h-full w-full bg-gray-100 dark:bg-gray-700 animate-pulse rounded-lg" />
);

// Dynamic imports for map components - reduces initial bundle size
// Maps are heavy due to react-simple-maps and topojson data
const RegionMap = dynamic(() => import('./maps/RegionMap'), {
  loading: () => <MapLoadingPlaceholder />,
  ssr: false,
});
const CategoryMarkerMap = dynamic(() => import('./maps/CategoryMarkerMap'), {
  loading: () => <MapLoadingPlaceholder />,
  ssr: false,
});

// Import configs directly (no wrapper components needed - DRY)
import { US_REGION_CONFIG, WORLD_REGION_CONFIG, US_MARKER_CONFIG, WORLD_MARKER_CONFIG } from './maps/mapConfigs';

// Categories that use US map (Albers USA projection)
const US_MARKER_CATEGORIES = new Set<Category>([
  'nationalParks', 'nationalMonuments', 'stateParks', 'fourteeners', 'weirdAmericana', 'usCities'
]);

// Check if category uses region coloring (countries/states) vs markers (other categories)
function usesRegionMap(category: Category): boolean {
  return category === 'countries' || category === 'states';
}

// Get the appropriate map component for a category
function getMapComponent(
  category: Category,
  selections: MapVisualizationProps['selections'],
  onToggle?: (id: string, currentStatus: Status) => void,
  subcategory?: string,
  tooltip?: TooltipHandlers,
  items?: MapVisualizationProps['items']
) {
  const handlers = tooltip || {
    onMouseEnter: () => {},
    onMouseLeave: () => {},
    onMouseMove: () => {},
  };

  // Region maps for countries and states (colored polygons)
  if (category === 'countries') {
    return <RegionMap key="world" selections={selections} onToggle={onToggle} tooltip={handlers} {...WORLD_REGION_CONFIG} />;
  }
  if (category === 'states') {
    return <RegionMap key="us" selections={selections} onToggle={onToggle} tooltip={handlers} {...US_REGION_CONFIG} />;
  }

  // Marker maps for all other categories (DRY - use CategoryMarkerMap directly with config)
  const isUSCategory = US_MARKER_CATEGORIES.has(category);
  const config = isUSCategory ? US_MARKER_CONFIG : WORLD_MARKER_CONFIG;
  // Key by geography, not category, to avoid remounting the map when switching
  // between categories that use the same base map (e.g., "National Parks" to "State Parks").
  // This keeps the heavy background component mounted and memoized.
  const mapKey = isUSCategory ? 'us-marker-map' : 'world-marker-map';

  return (
    <CategoryMarkerMap
      key={mapKey}
      category={category}
      selections={selections}
      onToggle={onToggle}
      subcategory={subcategory}
      tooltip={handlers}
      items={items}
      config={config}
    />
  );
}

const MapVisualization = memo(function MapVisualization({ category, selections, onToggle, subcategory, items }: MapVisualizationProps) {
  const isRegionMap = usesRegionMap(category);
  // Only store tooltip content in state - position is handled via ref for performance
  const [tooltipContent, setTooltipContent] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [showTwoFingerHint, setShowTwoFingerHint] = useState(false);
  const hintTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fix sticky pointer on iPad Magic Keyboard by releasing pointer capture on pointerup
  // This handles cases where d3-zoom captures the pointer but doesn't release it
  // iPad trackpad behaves as a hybrid pointer type and d3-zoom may capture on an ancestor element
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handlePointerUp = (e: PointerEvent) => {
      // Walk up the DOM tree and release pointer capture from any element that has it
      // d3-zoom may set capture on SVG or container elements, not just the target
      let element: Element | null = e.target as Element;
      while (element && element !== document.documentElement) {
        try {
          if (element.hasPointerCapture?.(e.pointerId)) {
            element.releasePointerCapture(e.pointerId);
          }
        } catch {
          // Ignore errors - some elements don't support pointer capture
        }
        element = element.parentElement;
      }
    };

    // Also handle global pointer events as a fallback for iPad trackpad
    // When Ctrl+click releases the capture, it's because the right-click context
    // sends different events - we simulate this by listening at document level
    const handleGlobalPointerUp = (e: PointerEvent) => {
      // Only process if the event originated from within our container
      if (!container.contains(e.target as Node)) return;

      // Check the container and all its children for pointer capture
      const allElements = container.querySelectorAll('*');
      allElements.forEach((el) => {
        try {
          if (el.hasPointerCapture?.(e.pointerId)) {
            el.releasePointerCapture(e.pointerId);
          }
        } catch {
          // Ignore errors
        }
      });
    };

    // Listen on the container for all pointerup events (capture phase)
    container.addEventListener('pointerup', handlePointerUp, true);
    container.addEventListener('pointercancel', handlePointerUp, true);

    // Also listen at document level as fallback
    document.addEventListener('pointerup', handleGlobalPointerUp, true);

    return () => {
      container.removeEventListener('pointerup', handlePointerUp, true);
      container.removeEventListener('pointercancel', handlePointerUp, true);
      document.removeEventListener('pointerup', handleGlobalPointerUp, true);
    };
  }, []);

  // Track whether tooltip is open via ref (avoids re-adding listeners on content changes)
  const tooltipOpenRef = useRef(false);
  tooltipOpenRef.current = !!tooltipContent;

  // OPTIMIZATION: Add dismiss listeners once on mount instead of on every tooltip content change
  // This avoids thrashing the DOM event registry when tooltip text updates frequently
  useEffect(() => {
    const dismissTooltip = () => {
      // Only dismiss if tooltip is actually open (check ref, not state)
      if (tooltipOpenRef.current) {
        setTooltipContent(null);
      }
    };

    // Dismiss on scroll (user scrolling the page)
    window.addEventListener('scroll', dismissTooltip, true);
    // Dismiss on any touch (user tapping elsewhere on mobile)
    window.addEventListener('touchstart', dismissTooltip, true);

    return () => {
      window.removeEventListener('scroll', dismissTooltip, true);
      window.removeEventListener('touchstart', dismissTooltip, true);
    };
  }, []);

  // Show two-finger hint on single-touch pan attempts (mobile UX)
  // This prevents the "scroll trap" where users get stuck trying to scroll past the map
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      // Show hint for single-finger touch (trying to scroll)
      if (e.touches.length === 1) {
        // Clear any existing timeout
        if (hintTimeoutRef.current) {
          clearTimeout(hintTimeoutRef.current);
        }
        setShowTwoFingerHint(true);
        // Auto-hide after 2 seconds
        hintTimeoutRef.current = setTimeout(() => {
          setShowTwoFingerHint(false);
        }, 2000);
      } else {
        // Two or more fingers - user is trying to interact with map
        setShowTwoFingerHint(false);
        if (hintTimeoutRef.current) {
          clearTimeout(hintTimeoutRef.current);
        }
      }
    };

    const handleTouchEnd = () => {
      // Hide hint shortly after touch ends
      if (hintTimeoutRef.current) {
        clearTimeout(hintTimeoutRef.current);
      }
      hintTimeoutRef.current = setTimeout(() => {
        setShowTwoFingerHint(false);
      }, 1000);
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
      if (hintTimeoutRef.current) {
        clearTimeout(hintTimeoutRef.current);
      }
    };
  }, []);

  // Memoize individual handlers
  // Handle both React synthetic events and native events from react-simple-maps
  const getMousePosition = useCallback((e: React.MouseEvent | MouseEvent) => {
    // Try clientX/Y first (most reliable for fixed positioning)
    if ('clientX' in e && typeof e.clientX === 'number') {
      return { x: e.clientX, y: e.clientY };
    }
    // Fallback to nativeEvent if available
    if ('nativeEvent' in e && e.nativeEvent) {
      const native = e.nativeEvent as MouseEvent;
      return { x: native.clientX, y: native.clientY };
    }
    return null;
  }, []);

  // Update tooltip position via ref (no re-render) for smooth 60fps tracking
  const updateTooltipPosition = useCallback((x: number, y: number) => {
    if (tooltipRef.current) {
      tooltipRef.current.style.left = `${x + 10}px`;
      tooltipRef.current.style.top = `${y + 10}px`;
    }
  }, []);

  const onMouseEnter = useCallback((content: string, e: React.MouseEvent) => {
    const pos = getMousePosition(e);
    if (pos) {
      setTooltipContent(content);
      // Immediately position (will be applied when ref mounts)
      requestAnimationFrame(() => updateTooltipPosition(pos.x, pos.y));
    }
  }, [getMousePosition, updateTooltipPosition]);

  const onMouseLeave = useCallback(() => {
    setTooltipContent(null);
  }, []);

  // Use ref-based positioning to avoid React re-renders at 60fps
  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const pos = getMousePosition(e);
    if (pos) {
      updateTooltipPosition(pos.x, pos.y);
    }
  }, [getMousePosition, updateTooltipPosition]);

  // Memoize the handlers object to prevent unnecessary re-renders of child maps
  const tooltipHandlers: TooltipHandlers = useMemo(() => ({
    onMouseEnter,
    onMouseLeave,
    onMouseMove,
  }), [onMouseEnter, onMouseLeave, onMouseMove]);

  return (
    // Removed touch-action-none to allow single-finger page scrolling
    // Two-finger gestures still work for map pan/zoom via d3-zoom
    <div
      ref={containerRef}
      className="w-full bg-primary-50/50 dark:bg-slate-800/50 rounded-2xl overflow-hidden border border-black/5 dark:border-white/10 shadow-premium-lg mb-6 relative will-change-transform"
    >
      <div className="w-full overflow-hidden aspect-[2/1]">
        {getMapComponent(category, selections, onToggle, subcategory, tooltipHandlers, items)}
      </div>

      {/* Two-finger pan hint overlay for mobile */}
      {showTwoFingerHint && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center pointer-events-none z-40 animate-fade-in">
          <div className="bg-white dark:bg-slate-800 px-4 py-3 rounded-xl shadow-lg flex items-center gap-3">
            <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
            </svg>
            <span className="text-sm font-medium text-primary-800 dark:text-primary-200">
              Use two fingers to move the map
            </span>
          </div>
        </div>
      )}

      {/* Tooltip - rendered via portal to escape CSS transform stacking context */}
      {/* Position is updated via ref for smooth 60fps tracking without re-renders */}
      {tooltipContent && typeof document !== 'undefined' && createPortal(
        <div
          ref={tooltipRef}
          className="fixed z-50 px-2 py-1 text-sm font-medium text-white bg-gray-900 rounded shadow-lg pointer-events-none whitespace-nowrap"
          style={{ left: 0, top: 0 }}
        >
          {tooltipContent}
        </div>,
        document.body
      )}

      {/* Legend */}
      {/* Added flex-wrap to prevent overflow on small screens */}
      <div className="flex justify-center flex-wrap gap-x-6 gap-y-2 pb-4 text-sm text-primary-600 dark:text-primary-300 px-2">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
          <span>Visited</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-500"></span>
          <span>Bucket List</span>
        </div>
        {isRegionMap && (
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gray-200 dark:bg-gray-600 border border-gray-300 dark:border-gray-500"></span>
            <span>Not Visited</span>
          </div>
        )}
      </div>
    </div>
  );
});

export default MapVisualization;
