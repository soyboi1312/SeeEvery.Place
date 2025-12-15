/**
 * InteractiveMapShell Component
 * Generic wrapper that encapsulates react-simple-maps boilerplate
 * Following DRY principle - shared zoom/pan mechanics for all map types
 */
'use client';

import { ReactNode, memo, useState, useRef, useEffect } from 'react';
import { ComposableMap, ZoomableGroup, Sphere, Graticule } from '@vnedyalk0v/react19-simple-maps';
import { useMapZoom, MapPosition } from './useMapZoom';
import { useDebounce } from '@/lib/hooks/useDebounce';
import ZoomControls from './ZoomControls';

// Zoom state passed to children via render prop
export interface ZoomState {
  position: MapPosition;
  zoom: number;
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

  // --- Scroll Zoom Delay Logic ---
  // Prevents accidental zooming when scrolling past the map
  // Scroll zoom only enabled after hovering for 800ms
  const [isScrollZoomEnabled, setIsScrollZoomEnabled] = useState(false);
  const zoomTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    // Start a timer when user hovers. If they stay for 800ms, enable scroll zoom.
    zoomTimerRef.current = setTimeout(() => {
      setIsScrollZoomEnabled(true);
    }, 800);
  };

  const handleMouseLeave = () => {
    // If they leave before the timer fires, cancel it.
    if (zoomTimerRef.current) {
      clearTimeout(zoomTimerRef.current);
      zoomTimerRef.current = null;
    }
    // Immediately disable scroll zoom so the page scrolls normally again
    setIsScrollZoomEnabled(false);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (zoomTimerRef.current) clearTimeout(zoomTimerRef.current);
    };
  }, []);
  // ------------------------------------

  const zoomState: ZoomState = {
    position,
    zoom: position.zoom,
  };

  return (
    <div
      className="relative w-full h-full group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <ComposableMap
        projection={projection}
        projectionConfig={projectionConfig}
        width={width}
        height={height}
        viewBox={viewBox}
        className={className}
      >
        <ZoomableGroup
          zoom={position.zoom}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Library uses branded Longitude/Latitude types
          center={position.coordinates as any}
          onMoveEnd={handleMoveEnd}
          // Only allow scrolling if the timer has completed
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          filterZoomEvent={(evt: any) => {
            if (evt.type === 'wheel' && !isScrollZoomEnabled) return false;
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
    </div>
  );
});

export default InteractiveMapShell;
