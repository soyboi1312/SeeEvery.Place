/**
 * InteractiveMapShell Component
 * Generic wrapper that encapsulates react-simple-maps boilerplate
 * Following DRY principle - shared zoom/pan mechanics for all map types
 */
'use client';

import { ReactNode, memo, useState, useRef, useEffect, useCallback } from 'react';
import { ComposableMap, ZoomableGroup, Sphere, Graticule } from '@vnedyalk0v/react19-simple-maps';
import { useMapZoom, MapPosition } from './useMapZoom';
import { useDebounce } from '@/lib/hooks/useDebounce';
import ZoomControls from './ZoomControls';
import { MarkerSymbolDefs } from '@/components/MapMarkers';

// Zoom state passed to children via render prop
export interface ZoomState {
  position: MapPosition;
  zoom: number;
  // Programmatic zoom to coordinates (for cluster expansion)
  zoomTo: (coordinates: [number, number], zoom: number) => void;
}

interface InteractiveMapShellProps {
  // Map projection settings
  projection: string;
  projectionConfig: Record<string, unknown>;

  // Viewport settings
  width?: number;
  height?: number;
  viewBox?: string;

  // Zoom settings
  initialCenter?: [number, number];
  initialZoom?: number;
  maxZoom?: number;

  // Optional world map decorations (sphere and graticule)
  showSphere?: boolean;
  showGraticule?: boolean;

  // Render prop pattern - receives zoom state for marker sizing
  children: (zoomState: ZoomState) => ReactNode;

  // Optional className override
  className?: string;

  // Optional callback when zoom changes (for marker clustering)
  onZoomChange?: (zoom: number) => void;
}

const InteractiveMapShell = memo(function InteractiveMapShell({
  projection,
  projectionConfig,
  width = 800,
  height = 400,
  viewBox,
  initialCenter = [0, 0],
  initialZoom = 1,
  maxZoom = 8,
  showSphere = false,
  showGraticule = false,
  children,
  className = 'w-full h-full',
  onZoomChange,
}: InteractiveMapShellProps) {
  const {
    position,
    handleZoomIn,
    handleZoomOut,
    handleMoveEnd,
    zoomTo,
    canZoomIn,
    canZoomOut,
  } = useMapZoom({
    maxZoom,
    initialCenter,
    initialZoom,
  });

  // Debounce zoom value to prevent excessive re-renders during zoom gestures
  // 150ms delay balances responsiveness with performance
  const debouncedZoom = useDebounce(position.zoom, 150);

  // Notify parent of zoom changes for clustering (debounced)
  useEffect(() => {
    onZoomChange?.(debouncedZoom);
  }, [debouncedZoom, onZoomChange]);

  // --- Ctrl/Meta Scroll Zoom Logic ---
  // Standard UX: Only zoom with Ctrl+scroll (Windows/Linux) or Cmd+scroll (Mac)
  // Show hint when user tries to scroll without modifier key
  const [showScrollHint, setShowScrollHint] = useState(false);
  const hintTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Show hint briefly when user scrolls without modifier
  const showHintBriefly = useCallback(() => {
    setShowScrollHint(true);
    if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
    hintTimeoutRef.current = setTimeout(() => setShowScrollHint(false), 2000);
  }, []);

  // Handle wheel events to detect scroll-without-modifier attempts
  const handleWheel = useCallback((e: React.WheelEvent) => {
    // If user is scrolling without Ctrl/Meta, show the hint
    if (!e.ctrlKey && !e.metaKey) {
      showHintBriefly();
    } else {
      setShowScrollHint(false);
    }
  }, [showHintBriefly]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
    };
  }, []);
  // ------------------------------------

  const zoomState: ZoomState = {
    position,
    zoom: position.zoom,
    zoomTo,
  };

  return (
    <div
      className="relative w-full h-full group"
      onWheel={handleWheel}
      // CSS containment optimization: isolates map paint/layout from the rest of the page
      // Prevents expensive layout recalculations when map DOM updates (e.g., marker changes)
      //
      // IMPORTANT: containIntrinsicSize prevents CLS (Cumulative Layout Shift) when using
      // contentVisibility: 'auto'. Without it, the element can collapse to 0 height before
      // the browser calculates the actual size, causing layout shifts.
      // aspectRatio: 2/1 matches the parent container's aspect-[2/1] class for proper sizing.
      style={{
        contain: 'strict',
        contentVisibility: 'auto',
        containIntrinsicSize: 'auto 50vw', // Width auto, height ~50% of viewport width (2:1 aspect)
        aspectRatio: '2 / 1', // Match parent aspect ratio for proper intrinsic sizing
      }}
    >
      <ComposableMap
        projection={projection}
        projectionConfig={projectionConfig}
        width={width}
        height={height}
        viewBox={viewBox}
        className={className}
      >
        {/* SVG symbol definitions for markers - defined once, referenced by all markers */}
        <MarkerSymbolDefs />
        <ZoomableGroup
          zoom={position.zoom}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Library uses branded Longitude/Latitude types
          center={position.coordinates as any}
          onMoveEnd={handleMoveEnd}
          // Standard UX: Only zoom if Ctrl/Meta is pressed (like Google Maps)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          filterZoomEvent={(evt: any) => {
            if (evt.type === 'wheel' && !evt.ctrlKey && !evt.metaKey) return false;
            return true;
          }}
        >
          {/* Optional world map decorations */}
          {showSphere && (
            <Sphere stroke="#E4E5E6" strokeWidth={0.5} id="sphere" fill="none" />
          )}
          {showGraticule && (
            <Graticule stroke="#E4E5E6" strokeWidth={0.5} />
          )}

          {/* Render children with zoom state */}
          {children(zoomState)}
        </ZoomableGroup>
      </ComposableMap>
      <ZoomControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        canZoomIn={canZoomIn}
        canZoomOut={canZoomOut}
      />

      {/* Scroll hint overlay - shown when user scrolls without Ctrl/Cmd */}
      {showScrollHint && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center pointer-events-none z-40 animate-fade-in">
          <div className="bg-white dark:bg-slate-800 px-4 py-3 rounded-xl shadow-lg flex items-center gap-3">
            <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
            <span className="text-sm font-medium text-primary-800 dark:text-primary-200">
              Use <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">Ctrl</kbd> + scroll to zoom
            </span>
          </div>
        </div>
      )}
    </div>
  );
});

export default InteractiveMapShell;
