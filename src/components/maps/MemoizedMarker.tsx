/**
 * MemoizedMarker Component
 * A memoized wrapper around react-simple-maps Marker to prevent unnecessary re-renders
 * Only re-renders when the marker's status or coordinates change
 */
'use client';

import { memo, ReactNode, useCallback } from 'react';
import { Marker } from '@vnedyalk0v/react19-simple-maps';
import { Status } from '@/lib/types';
import { MarkerSize } from '@/components/MapMarkers';
import { useMobileTap } from './useMobileTap';

interface MemoizedMarkerProps {
  id: string;
  coordinates: [number, number];
  status: Status;
  name: string;
  size?: MarkerSize; // Explicit size prop for comparison (children prop is not compared)
  onToggle?: (id: string, currentStatus: Status) => void;
  onMouseEnter: (content: string, e: React.MouseEvent) => void;
  onMouseLeave: () => void;
  onMouseMove: (e: React.MouseEvent) => void;
  children: ReactNode;
}

const MemoizedMarker = memo(function MemoizedMarker({
  id,
  coordinates,
  status,
  name,
  size,
  onToggle,
  onMouseEnter,
  onMouseLeave,
  onMouseMove,
  children,
}: MemoizedMarkerProps) {
  // size prop is used for comparison only; actual rendering uses children
  const statusLabel = status === 'visited' ? 'visited' : status === 'bucketList' ? 'on bucket list' : 'not visited';

  const handleTap = useCallback(() => {
    onToggle?.(id, status);
  }, [id, status, onToggle]);

  const { onTouchStart, onTouchEnd } = useMobileTap(handleTap);

  return (
    <Marker
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Library uses branded Longitude/Latitude types
      coordinates={coordinates as any}
      onClick={handleTap}
      onMouseEnter={(e) => onMouseEnter(name, e)}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
    >
      <g
        className="cursor-pointer outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        tabIndex={0}
        role="button"
        aria-label={`${name}, ${statusLabel}`}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && onToggle) {
            e.preventDefault();
            onToggle(id, status);
          }
        }}
      >
        {children}
      </g>
    </Marker>
  );
}, (prev, next) => {
  // Custom comparison: only re-render if status, coordinates, name, or size changes
  // onToggle and tooltip handlers are expected to be stable (memoized in parent)
  // Note: children prop is NOT compared - use size prop to trigger re-renders on zoom
  return (
    prev.status === next.status &&
    prev.size === next.size &&
    prev.coordinates[0] === next.coordinates[0] &&
    prev.coordinates[1] === next.coordinates[1] &&
    prev.name === next.name &&
    prev.id === next.id
  );
});

export default MemoizedMarker;
