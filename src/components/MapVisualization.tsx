/**
 * src/components/MapVisualization.tsx
 * Main map visualization component that composes individual map types
 */
'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
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
const WorldMap = dynamic(() => import('./maps/WorldMap'), {
  loading: MapLoadingPlaceholder,
  ssr: false,
});
const USMap = dynamic(() => import('./maps/USMap'), {
  loading: MapLoadingPlaceholder,
  ssr: false,
});
const USMarkerMap = dynamic(() => import('./maps/USMarkerMap'), {
  loading: MapLoadingPlaceholder,
  ssr: false,
});
const WorldMarkerMap = dynamic(() => import('./maps/WorldMarkerMap'), {
  loading: MapLoadingPlaceholder,
  ssr: false,
});

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

  switch (category) {
    case 'countries':
      return <WorldMap key="world" selections={selections} onToggle={onToggle} tooltip={handlers} />;
    case 'states':
      return <USMap key="us" selections={selections} onToggle={onToggle} tooltip={handlers} />;
    case 'nationalParks':
      return <USMarkerMap key="us-parks" category={category} selections={selections} onToggle={onToggle} tooltip={handlers} items={items} />;
    case 'nationalMonuments':
      return <USMarkerMap key="us-monuments" category={category} selections={selections} onToggle={onToggle} tooltip={handlers} items={items} />;
    case 'stateParks':
      return <USMarkerMap key="us-state-parks" category={category} selections={selections} onToggle={onToggle} tooltip={handlers} items={items} />;
    case 'fourteeners':
      return <USMarkerMap key="us-14ers" category={category} selections={selections} onToggle={onToggle} tooltip={handlers} items={items} />;
    case 'weirdAmericana':
      return <USMarkerMap key="us-weird" category={category} selections={selections} onToggle={onToggle} tooltip={handlers} items={items} />;
    default:
      return <WorldMarkerMap key="world-markers" category={category} selections={selections} onToggle={onToggle} subcategory={subcategory} tooltip={handlers} items={items} />;
  }
}

export default function MapVisualization({ category, selections, onToggle, subcategory, items }: MapVisualizationProps) {
  const isRegionMap = usesRegionMap(category);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showTwoFingerHint, setShowTwoFingerHint] = useState(false);
  const hintTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fix sticky pointer on iPad Magic Keyboard by releasing pointer capture on pointerup
  // This handles cases where d3-zoom captures the pointer but doesn't release it
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handlePointerUp = (e: PointerEvent) => {
      // Release pointer capture from any element that has it
      const target = e.target as Element;
      if (target?.hasPointerCapture?.(e.pointerId)) {
        target.releasePointerCapture(e.pointerId);
      }
    };

    // Listen on the container for all pointerup events (capture phase)
    container.addEventListener('pointerup', handlePointerUp, true);
    container.addEventListener('pointercancel', handlePointerUp, true);

    return () => {
      container.removeEventListener('pointerup', handlePointerUp, true);
      container.removeEventListener('pointercancel', handlePointerUp, true);
    };
  }, []);

  // Dismiss tooltip on scroll or touch anywhere (mobile fix)
  // This handles cases where tooltip gets stuck on hybrid devices or when scrolling
  useEffect(() => {
    if (!tooltip) return;

    const dismissTooltip = () => setTooltip(null);

    // Dismiss on scroll (user scrolling the page)
    window.addEventListener('scroll', dismissTooltip, true);
    // Dismiss on any touch (user tapping elsewhere on mobile)
    window.addEventListener('touchstart', dismissTooltip, true);

    return () => {
      window.removeEventListener('scroll', dismissTooltip, true);
      window.removeEventListener('touchstart', dismissTooltip, true);
    };
  }, [tooltip]);

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

  const onMouseEnter = useCallback((content: string, e: React.MouseEvent) => {
    const pos = getMousePosition(e);
    if (pos) {
      setTooltip({ content, x: pos.x, y: pos.y });
    }
  }, [getMousePosition]);

  const onMouseLeave = useCallback(() => {
    setTooltip(null);
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const pos = getMousePosition(e);
    if (pos) {
      setTooltip(prev => prev ? { ...prev, x: pos.x, y: pos.y } : null);
    }
  }, [getMousePosition]);

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
      className="w-full bg-primary-50/50 dark:bg-slate-800/50 rounded-2xl overflow-hidden border border-black/5 dark:border-white/10 shadow-premium-lg mb-6 relative"
    >
      <div className="w-full overflow-hidden">
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
      {tooltip && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed z-50 px-2 py-1 text-sm font-medium text-white bg-gray-900 rounded shadow-lg pointer-events-none whitespace-nowrap"
          style={{
            left: tooltip.x + 10,
            top: tooltip.y + 10,
          }}
        >
          {tooltip.content}
        </div>,
        document.body
      )}

      {/* Legend */}
      <div className="flex justify-center gap-6 pb-4 text-sm text-primary-600 dark:text-primary-300">
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
}
