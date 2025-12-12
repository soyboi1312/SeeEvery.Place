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
    // touch-action-none prevents browser gestures capturing pointer events on hybrid devices
    <div
      ref={containerRef}
      className="w-full bg-primary-50/50 dark:bg-slate-800/50 rounded-2xl overflow-hidden border border-black/5 dark:border-white/10 shadow-premium-lg mb-6 relative touch-action-none"
    >
      <div className="w-full overflow-hidden">
        {getMapComponent(category, selections, onToggle, subcategory, tooltipHandlers, items)}
      </div>

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
