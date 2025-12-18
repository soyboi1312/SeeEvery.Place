/**
 * ClusterMarker Component
 * Renders a cluster of markers showing the count and dominant status color
 */
'use client';

import { memo } from 'react';
import { Marker } from '@vnedyalk0v/react19-simple-maps';
import { Status } from '@/lib/types';

interface ClusterMarkerProps {
  coordinates: [number, number];
  pointCount: number;
  dominantStatus: Status;
  size?: 'small' | 'default';
  onClick?: () => void;
}

const ClusterMarker = memo(function ClusterMarker({
  coordinates,
  pointCount,
  dominantStatus,
  size = 'default',
  onClick,
}: ClusterMarkerProps) {
  // Calculate cluster size based on point count
  const baseSize = size === 'small' ? 16 : 24;
  const clusterSize = Math.min(baseSize + Math.log2(pointCount) * 4, baseSize * 2);

  // Color based on dominant status
  const fillColor = dominantStatus === 'visited' ? '#22c55e' :
                    dominantStatus === 'bucketList' ? '#f59e0b' : '#94a3b8';

  // Text color: dark on amber for WCAG contrast (amber-950 on amber-500 = 7.5:1 ratio)
  // White text on amber has only 1.96:1 contrast, failing accessibility
  const textColor = dominantStatus === 'bucketList' ? '#451a03' : 'white';

  // Format count for display
  const displayCount = pointCount > 99 ? '99+' : pointCount.toString();
  const fontSize = pointCount > 99 ? 8 : 10;

  // Minimum 22px radius for 44px touch target (iOS/Android accessibility guidelines)
  const hitAreaRadius = Math.max(clusterSize / 2 + 3, 22);

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Library uses branded Coordinates type
    <Marker coordinates={coordinates as any}>
      <g
        onClick={onClick}
        tabIndex={onClick ? 0 : undefined}
        role={onClick ? 'button' : undefined}
        aria-label={`Cluster of ${pointCount} places, mostly ${dominantStatus}. Click to zoom in.`}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && onClick) {
            e.preventDefault();
            onClick();
          }
        }}
        style={{ cursor: onClick ? 'pointer' : 'default' }}
        className="transition-transform hover:scale-110 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      >
        {/* Invisible hit area for mobile touch targets (minimum 44px) */}
        <circle r={hitAreaRadius} fill="transparent" />
        {/* Outer ring */}
        <circle
          r={clusterSize / 2 + 3}
          fill={fillColor}
          fillOpacity={0.2}
          stroke={fillColor}
          strokeWidth={1.5}
          strokeOpacity={0.5}
        />
        {/* Inner circle */}
        <circle
          r={clusterSize / 2}
          fill={fillColor}
          stroke="white"
          strokeWidth={2}
        />
        {/* Count text */}
        <text
          textAnchor="middle"
          dominantBaseline="central"
          style={{
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: `${fontSize}px`,
            fontWeight: 600,
            fill: textColor,
            pointerEvents: 'none',
          }}
        >
          {displayCount}
        </text>
      </g>
    </Marker>
  );
});

export default ClusterMarker;
