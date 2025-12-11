/**
 * TappableGeography Component
 * Wraps react-simple-maps Geography with mobile tap detection.
 *
 * On mobile, the ZoomableGroup's D3 drag handling can intercept touch events,
 * preventing onClick handlers from firing. This component adds touch handlers
 * that detect quick taps and trigger the toggle callback.
 */
'use client';

import { useCallback } from 'react';
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
  const handleTap = useCallback(() => {
    if (id && onToggle) {
      onToggle(id, status);
    }
  }, [id, status, onToggle]);

  const { onTouchStart, onTouchEnd } = useMobileTap(handleTap);

  const statusClass = status === 'bucketList' ? 'bucket-list' : status;
  const statusLabel = status === 'visited' ? 'visited' : status === 'bucketList' ? 'on bucket list' : 'not visited';

  return (
    <Geography
      geography={geo}
      className={`region-path ${statusClass} outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500`}
      style={{
        default: { outline: "none" },
        hover: { outline: "none", filter: "brightness(0.9)" },
        pressed: { outline: "none" },
      }}
      data-tip={name}
      tabIndex={0}
      role="button"
      aria-label={`${name}, ${statusLabel}`}
      onClick={handleTap}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && id && onToggle) {
          e.preventDefault();
          onToggle(id, status);
        }
      }}
      onMouseEnter={(e) => onMouseEnter(name, e)}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
    />
  );
}
