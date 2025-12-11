/**
 * TappableGeography Component
 * Wraps react-simple-maps Geography with mobile tap detection.
 *
 * On mobile, the ZoomableGroup's D3 drag handling can intercept touch events,
 * preventing onClick handlers from firing. This component adds touch handlers
 * that detect quick taps and trigger the toggle callback.
 */
'use client';

import { useCallback, useRef } from 'react';
import { Geography } from '@vnedyalk0v/react19-simple-maps';
import { Status } from '@/lib/types';
import { useMobileTap } from './useMobileTap';

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Geography geo object type from library
type GeoObject = any;

interface TappableGeographyProps {
  geo: GeoObject;
  id: string | undefined;
  status: Status;
  name: string;
  onToggle?: (id: string, currentStatus: Status) => void;
  onMouseEnter: (content: string, e: React.MouseEvent) => void;
  onMouseLeave: () => void;
  onMouseMove: (e: React.MouseEvent) => void;
}

export function TappableGeography({
  geo,
  id,
  status,
  name,
  onToggle,
  onMouseEnter,
  onMouseLeave,
  onMouseMove,
}: TappableGeographyProps) {
  // Track if a touch interaction is happening to suppress mouse events
  const isTouchActive = useRef(false);

  const handleTap = useCallback(() => {
    if (id && onToggle) {
      onToggle(id, status);
    }
  }, [id, status, onToggle]);

  const { onTouchStart: hookTouchStart, onTouchEnd: hookTouchEnd } = useMobileTap(handleTap);

  // Wrap touch handlers to track touch state
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    isTouchActive.current = true;
    hookTouchStart(e);
  }, [hookTouchStart]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    hookTouchEnd(e);
    // Reset touch active flag after a delay to cover the browser's
    // simulated mouse event firing window (usually ~300ms)
    setTimeout(() => {
      isTouchActive.current = false;
    }, 500);
  }, [hookTouchEnd]);

  // Wrap mouse enter to ignore it if we are touching
  const handleMouseEnter = useCallback((e: React.MouseEvent) => {
    // If this mouse enter was triggered by a touch (simulated), ignore it
    // to prevent sticky tooltips on mobile.
    if (isTouchActive.current) return;

    onMouseEnter(name, e);
  }, [name, onMouseEnter]);

  const statusClass = status === 'bucketList' ? 'bucket-list' : status;
  const statusLabel = status === 'visited' ? 'visited' : status === 'bucketList' ? 'on bucket list' : 'not visited';

  return (
    <Geography
      geography={geo}
      className={`region-path ${statusClass} outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500`}
      style={{
        default: { outline: "none" },
        // Note: The 'hover' style here might still trigger on tap in some browsers,
        // but removing the tooltip via handleMouseEnter fixes the main UX issue.
        hover: { outline: "none", filter: "brightness(0.9)" },
        pressed: { outline: "none" },
      }}
      data-tip={name}
      tabIndex={0}
      role="button"
      aria-label={`${name}, ${statusLabel}`}
      onClick={handleTap}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && id && onToggle) {
          e.preventDefault();
          onToggle(id, status);
        }
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
    />
  );
}
