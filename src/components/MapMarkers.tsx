/**
 * Shared map marker SVG components
 * Used by both MapVisualization and ShareCard
 *
 * All marker components are memoized to prevent unnecessary re-renders
 * when rendering many markers on the map.
 */

import { memo } from 'react';

export type MarkerSize = 'default' | 'small';

interface MarkerProps {
  fillColor: string;
  size?: MarkerSize;
}

interface SportMarkerProps extends MarkerProps {
  sport: string | undefined;
}

// Sport-specific marker SVG paths for stadiums
function SportMarkerBase({ sport, fillColor, size = 'default' }: SportMarkerProps) {
  const isSmall = size === 'small';
  const strokeColor = "#ffffff";
  const strokeWidth = isSmall ? 0.6 : 0.8;

  switch (sport) {
    case "Football":
      // Soccer ball
      return isSmall ? (
        <g transform="translate(-5, -5)">
          <circle cx="5" cy="5" r="4.5" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
          <path d="M5 2.5L3.8 4.2L4.4 6H5.6L6.2 4.2L5 2.5Z" fill={strokeColor} />
          <path d="M5 2.5V1.2" stroke={strokeColor} strokeWidth={0.4} />
          <path d="M6.2 4.2L7.5 3.5" stroke={strokeColor} strokeWidth={0.4} />
          <path d="M5.6 6L7 8" stroke={strokeColor} strokeWidth={0.4} />
          <path d="M4.4 6L3 8" stroke={strokeColor} strokeWidth={0.4} />
          <path d="M3.8 4.2L2.5 3.5" stroke={strokeColor} strokeWidth={0.4} />
        </g>
      ) : (
        <g transform="translate(-8, -8)">
          <circle cx="8" cy="8" r="7" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
          <path d="M8 4L6 6.5L7 9.5H9L10 6.5L8 4Z" fill={strokeColor} />
          <path d="M8 4V2" stroke={strokeColor} strokeWidth={0.6} />
          <path d="M10 6.5L12 5.5" stroke={strokeColor} strokeWidth={0.6} />
          <path d="M9 9.5L11 12" stroke={strokeColor} strokeWidth={0.6} />
          <path d="M7 9.5L5 12" stroke={strokeColor} strokeWidth={0.6} />
          <path d="M6 6.5L4 5.5" stroke={strokeColor} strokeWidth={0.6} />
        </g>
      );

    case "American Football":
      return isSmall ? (
        <g transform="translate(-5, -5)">
          <ellipse cx="5" cy="5" rx="4.5" ry="2.5" transform="rotate(-45 5 5)" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
          <path d="M5 3v4" stroke={strokeColor} strokeWidth={0.4} />
          <path d="M4 4.5h2" stroke={strokeColor} strokeWidth={0.4} />
          <path d="M4 5.5h2" stroke={strokeColor} strokeWidth={0.4} />
        </g>
      ) : (
        <g transform="translate(-8, -8)">
          <ellipse cx="8" cy="8" rx="7" ry="4" transform="rotate(-45 8 8)" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
          <path d="M8 5v6" stroke={strokeColor} strokeWidth={0.6} />
          <path d="M6 7h4" stroke={strokeColor} strokeWidth={0.6} />
          <path d="M6 9h4" stroke={strokeColor} strokeWidth={0.6} />
        </g>
      );

    case "Baseball":
      return isSmall ? (
        <g transform="translate(-5, -5)">
          <circle cx="5" cy="5" r="4.5" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
          <path d="M3 2.5C3.6 4 3.6 6 3 7.5" stroke={strokeColor} strokeWidth={0.4} fill="none" />
          <path d="M7 2.5C6.4 4 6.4 6 7 7.5" stroke={strokeColor} strokeWidth={0.4} fill="none" />
        </g>
      ) : (
        <g transform="translate(-8, -8)">
          <circle cx="8" cy="8" r="7" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
          <path d="M4.5 4C5.5 6 5.5 10 4.5 12" stroke={strokeColor} strokeWidth={0.6} fill="none" />
          <path d="M11.5 4C10.5 6 10.5 10 11.5 12" stroke={strokeColor} strokeWidth={0.6} fill="none" />
          <path d="M5 5.5L4 6" stroke={strokeColor} strokeWidth={0.5} />
          <path d="M5 10.5L4 10" stroke={strokeColor} strokeWidth={0.5} />
          <path d="M11 5.5L12 6" stroke={strokeColor} strokeWidth={0.5} />
          <path d="M11 10.5L12 10" stroke={strokeColor} strokeWidth={0.5} />
        </g>
      );

    case "Basketball":
      return isSmall ? (
        <g transform="translate(-5, -5)">
          <circle cx="5" cy="5" r="4.5" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
          <path d="M1 5.5C3 5 5 5 7 5s2 0 2.5.5" stroke={strokeColor} strokeWidth={0.4} fill="none" />
          <path d="M5 1v8" stroke={strokeColor} strokeWidth={0.4} />
          <path d="M7 8C6.2 6.5 6.2 3.5 7 2" stroke={strokeColor} strokeWidth={0.4} fill="none" />
          <path d="M3 8C3.8 6.5 3.8 3.5 3 2" stroke={strokeColor} strokeWidth={0.4} fill="none" />
        </g>
      ) : (
        <g transform="translate(-8, -8)">
          <circle cx="8" cy="8" r="7" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
          <path d="M2 9C4 8 6 8 8 8s4 0 6 1" stroke={strokeColor} strokeWidth={0.6} fill="none" />
          <path d="M8 2v12" stroke={strokeColor} strokeWidth={0.6} />
          <path d="M11.5 12C10 10 10 6 11.5 4" stroke={strokeColor} strokeWidth={0.6} fill="none" />
          <path d="M4.5 12C6 10 6 6 4.5 4" stroke={strokeColor} strokeWidth={0.6} fill="none" />
        </g>
      );

    case "Cricket":
      return isSmall ? (
        <g transform="translate(-5, -5)">
          <circle cx="5" cy="5" r="4.5" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
          <path d="M5 1c1.2 1.2 1.2 6.8 0 8" stroke={strokeColor} strokeWidth={0.4} strokeDasharray="1 0.6" fill="none" />
          <path d="M5 1c-1.2 1.2-1.2 6.8 0 8" stroke={strokeColor} strokeWidth={0.4} strokeDasharray="1 0.6" fill="none" />
        </g>
      ) : (
        <g transform="translate(-8, -8)">
          <circle cx="8" cy="8" r="7" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
          <path d="M8 2c2 2 2 10 0 12" stroke={strokeColor} strokeWidth={0.6} strokeDasharray="1.5 1" fill="none" />
          <path d="M8 2c-2 2-2 10 0 12" stroke={strokeColor} strokeWidth={0.6} strokeDasharray="1.5 1" fill="none" />
        </g>
      );

    case "Rugby":
      return isSmall ? (
        <g transform="translate(-5, -5)">
          <ellipse cx="5" cy="5" rx="5" ry="3.5" transform="rotate(-45 5 5)" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
          <path d="M3.5 6.5L3 7" stroke={strokeColor} strokeWidth={0.4} />
          <path d="M7 3L6.5 3.5" stroke={strokeColor} strokeWidth={0.4} />
          <path d="M3.5 3.5l3 3" stroke={strokeColor} strokeWidth={0.4} />
        </g>
      ) : (
        <g transform="translate(-8, -8)">
          <ellipse cx="8" cy="8" rx="8" ry="5.5" transform="rotate(-45 8 8)" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
          <path d="M6 10L5 11" stroke={strokeColor} strokeWidth={0.6} />
          <path d="M11 5L10 6" stroke={strokeColor} strokeWidth={0.6} />
          <path d="M5.5 5.5l5 5" stroke={strokeColor} strokeWidth={0.6} />
        </g>
      );

    case "Tennis":
      return isSmall ? (
        <g transform="translate(-5, -5)">
          <circle cx="5" cy="5" r="4.5" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
          <path d="M1 5c0 2.5 2 4.5 4 4.5" stroke={strokeColor} strokeWidth={0.6} fill="none" />
          <path d="M9 5c0-2.5-2-4.5-4-4.5" stroke={strokeColor} strokeWidth={0.6} fill="none" />
        </g>
      ) : (
        <g transform="translate(-8, -8)">
          <circle cx="8" cy="8" r="7" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
          <path d="M2 8c0 4 3 7 6 7" stroke={strokeColor} strokeWidth={0.8} fill="none" />
          <path d="M14 8c0-4-3-7-6-7" stroke={strokeColor} strokeWidth={0.8} fill="none" />
        </g>
      );

    case "Motorsport":
      // Checkered flag
      return isSmall ? (
        <g transform="translate(-5, -10)">
          <line x1="1.5" y1="1.5" x2="1.5" y2="10" stroke="#1e3a5f" strokeWidth="1" strokeLinecap="round" />
          <rect x="1.5" y="1.5" width="7" height="5.5" fill={fillColor} stroke={strokeColor} strokeWidth={0.4} />
          <rect x="1.5" y="1.5" width="1.75" height="1.4" fill="#ffffff" />
          <rect x="5" y="1.5" width="1.75" height="1.4" fill="#ffffff" />
          <rect x="3.25" y="2.9" width="1.75" height="1.4" fill="#ffffff" />
          <rect x="6.75" y="2.9" width="1.75" height="1.4" fill="#ffffff" />
          <rect x="1.5" y="4.3" width="1.75" height="1.4" fill="#ffffff" />
          <rect x="5" y="4.3" width="1.75" height="1.4" fill="#ffffff" />
          <rect x="3.25" y="5.7" width="1.75" height="1.3" fill="#ffffff" />
          <rect x="6.75" y="5.7" width="1.75" height="1.3" fill="#ffffff" />
        </g>
      ) : (
        <g transform="translate(-8, -14)">
          <line x1="2" y1="2" x2="2" y2="14" stroke="#1e3a5f" strokeWidth="1.5" strokeLinecap="round" />
          <rect x="2" y="2" width="10" height="8" fill={fillColor} stroke={strokeColor} strokeWidth={0.6} />
          <rect x="2" y="2" width="2.5" height="2" fill="#ffffff" />
          <rect x="7" y="2" width="2.5" height="2" fill="#ffffff" />
          <rect x="4.5" y="4" width="2.5" height="2" fill="#ffffff" />
          <rect x="9.5" y="4" width="2.5" height="2" fill="#ffffff" />
          <rect x="2" y="6" width="2.5" height="2" fill="#ffffff" />
          <rect x="7" y="6" width="2.5" height="2" fill="#ffffff" />
          <rect x="4.5" y="8" width="2.5" height="2" fill="#ffffff" />
          <rect x="9.5" y="8" width="2.5" height="2" fill="#ffffff" />
        </g>
      );

    default:
      // Default flag marker (generic stadium)
      return isSmall ? (
        <g transform="translate(-4, -8)">
          <line x1="1" y1="1.5" x2="1" y2="8" stroke="#1e3a5f" strokeWidth="1" strokeLinecap="round" />
          <path
            d="M1 1.5C1 1.5 3 0.5 4.5 1.5C6 2.5 8 1.5 8 1.5V5C8 5 6 6 4.5 5C3 4 1 5 1 5V1.5Z"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="0.3"
            strokeLinejoin="round"
          />
        </g>
      ) : (
        <g transform="translate(-6, -12)">
          <line x1="1.5" y1="2" x2="1.5" y2="12" stroke="#1e3a5f" strokeWidth="1.5" strokeLinecap="round" />
          <path
            d="M1.5 2C1.5 2 4.5 0.5 7 2C9.5 3.5 12 2 12 2V7C12 7 9.5 8.5 7 7C4.5 5.5 1.5 7 1.5 7V2Z"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="0.8"
            strokeLinejoin="round"
          />
        </g>
      );
  }
}

export const SportMarker = memo(SportMarkerBase);

// Sneaker marker for marathons
function SneakerMarkerBase({ fillColor, size = 'default' }: MarkerProps) {
  const isSmall = size === 'small';
  // Adjusted transform to center the new shape
  const transform = isSmall ? "translate(-7, -7) scale(0.6)" : "translate(-12, -12)";

  return (
    <g transform={transform}>
      {/* Shoe Silhouette */}
      <path
        d="M21.5 14.5c0-1.5-1-2.5-2.5-2.5h-1l-2-4h-3.5l-3 3-4-1.5L2 13v3.5c0 2 2.5 3.5 5 3.5h11c2.5 0 3.5-1.5 3.5-3.5V14.5z"
        fill={fillColor}
        stroke="#ffffff"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Sole Line */}
      <path
        d="M2.5 16.5c0 0 3 1.5 9 1.5s10-1.5 10-1.5"
        stroke="#ffffff"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Laces */}
      <path
        d="M9 10.5l2-2M11 12.5l2-2"
        stroke="#ffffff"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </g>
  );
}

export const SneakerMarker = memo(SneakerMarkerBase);

// Mountain peak marker with summit flag
function MountainMarkerBase({ fillColor, size = 'default' }: MarkerProps) {
  const isSmall = size === 'small';
  const strokeColor = "#ffffff";
  const transform = isSmall ? "translate(-6, -10) scale(0.5)" : "translate(-12, -20)";

  return (
    <g transform={transform}>
      {/* Mountain shape */}
      <path
        d="M3 20h18L12 5l-9 15z"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Snow cap / ridge detail */}
      <path
        d="M7.5 12.5l2.5 2 2-2 2 2 2.5-2"
        fill="none"
        stroke={strokeColor}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Flag pole */}
      <path
        d="M12 5V1"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Flag */}
      <path
        d="M12 1l5 2-5 2"
        fill={strokeColor}
        stroke={strokeColor}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}

export const MountainMarker = memo(MountainMarkerBase);

// F1 car marker for Formula 1 race tracks
function F1CarMarkerBase({ fillColor, size = 'default' }: MarkerProps) {
  const isSmall = size === 'small';
  const strokeColor = "#ffffff";
  const transform = isSmall ? "translate(-6, -8) scale(0.5)" : "translate(-12, -15)";

  return (
    <g transform={transform}>
      {/* Rear wing */}
      <path
        d="M2 8h4v3h-3"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Rear wheel */}
      <circle cx="7" cy="15" r="3" fill={fillColor} stroke={strokeColor} strokeWidth="1" />
      {/* Front wheel */}
      <circle cx="17" cy="15" r="3" fill={fillColor} stroke={strokeColor} strokeWidth="1" />
      {/* Body/chassis */}
      <path
        d="M10 15h4"
        stroke={strokeColor}
        strokeWidth="1"
        strokeLinecap="round"
      />
      {/* Cockpit/halo */}
      <path
        d="M7 12c1-2 2-4 5-4h2c2 0 4 2 6 4"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Front wing */}
      <path
        d="M20 15h2v-2h-3"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Air intake */}
      <path
        d="M11 8l2 0"
        stroke={strokeColor}
        strokeWidth="1"
        strokeLinecap="round"
      />
      {/* Side detail */}
      <path
        d="M13 10h2"
        stroke={strokeColor}
        strokeWidth="1"
        strokeLinecap="round"
      />
    </g>
  );
}

export const F1CarMarker = memo(F1CarMarkerBase);

// Flag marker for parks and general locations
function FlagMarkerBase({ fillColor, size = 'default' }: MarkerProps) {
  const isSmall = size === 'small';

  return isSmall ? (
    <g transform="translate(-4, -8)">
      <line x1="1" y1="1.5" x2="1" y2="8" stroke="#1e3a5f" strokeWidth="1" strokeLinecap="round" />
      <path
        d="M1 1.5C1 1.5 3 0.5 4.5 1.5C6 2.5 8 1.5 8 1.5V5C8 5 6 6 4.5 5C3 4 1 5 1 5V1.5Z"
        fill={fillColor}
        stroke="#ffffff"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
    </g>
  ) : (
    <g transform="translate(-9, -18)">
      <line x1="2" y1="3" x2="2" y2="18" stroke="#1e3a5f" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M2 3C2 3 6 1 10 3C14 5 17 3 17 3V10C17 10 14 12 10 10C6 8 2 10 2 10V3Z"
        fill={fillColor}
        stroke="#ffffff"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </g>
  );
}

export const FlagMarker = memo(FlagMarkerBase);

// Legacy function exports for backwards compatibility
export function renderSportMarker(sport: string | undefined, fillColor: string) {
  return <SportMarker sport={sport} fillColor={fillColor} size="default" />;
}

export function renderSneakerMarker(fillColor: string) {
  return <SneakerMarker fillColor={fillColor} size="default" />;
}

export function renderMountainMarker(fillColor: string) {
  return <MountainMarker fillColor={fillColor} size="default" />;
}

export function renderF1CarMarker(fillColor: string) {
  return <F1CarMarker fillColor={fillColor} size="default" />;
}
