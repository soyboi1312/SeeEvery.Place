/**
 * src/components/MapMarkers.tsx
 * Shared map marker SVG components.
 * All marker components are memoized to prevent unnecessary re-renders.
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

const STROKE_COLOR = "#ffffff";

// -----------------------------------------------------------------------------
// 1. AIRPLANE MARKER (High Fidelity)
// -----------------------------------------------------------------------------

function AirplaneMarkerBase({ fillColor, size = 'default' }: MarkerProps) {
  const isSmall = size === 'small';
  const transform = isSmall ? "translate(-8, -8) scale(0.6)" : "translate(-12, -12) scale(1)";

  return (
    <g transform={transform}>
      <path
        d="M17 11 L 21 9 L 22 10 L 19 12 Z"
        fill={fillColor}
        stroke={STROKE_COLOR}
        strokeWidth="0.5"
      />
      <path
        d="M2 13 Q 2 10, 5 9 L 7 8 L 16 8 L 19 4 L 22 4 L 20.5 10 Q 22 11, 22 12 Q 22 14, 18 13.5 L 10 13.5 Q 2 14.5, 2 13 Z"
        fill={fillColor}
        stroke={STROKE_COLOR}
        strokeWidth="0.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M5.5 9.5 L 7.5 9" stroke={STROKE_COLOR} strokeWidth="1" strokeLinecap="round" />
      <path d="M19.5 5 L 18.5 9" stroke={STROKE_COLOR} strokeWidth="0.5" opacity="0.6" />
      <path
        d="M9 11 L 14 17 L 17 16 L 15 11 Z"
        fill={fillColor}
        stroke={STROKE_COLOR}
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
      <path
        d="M10 15 L 10 16 Q 10 17.5, 13 17 L 13 16 Q 13 15, 10 15 Z"
        fill={STROKE_COLOR}
        stroke={fillColor}
        strokeWidth="0.5"
      />
      <path d="M11.5 15 L 12.5 13" stroke={STROKE_COLOR} strokeWidth="0.8" />
    </g>
  );
}
export const AirplaneMarker = memo(AirplaneMarkerBase);


// -----------------------------------------------------------------------------
// 2. SNEAKER MARKER (High Fidelity)
// -----------------------------------------------------------------------------

function SneakerMarkerBase({ fillColor, size = 'default' }: MarkerProps) {
  const isSmall = size === 'small';
  const transform = isSmall ? "translate(-8, -8) scale(0.6)" : "translate(-12, -12) scale(1)";

  return (
    <g transform={transform}>
      <path
        d="M2.5 12.5 C 2.5 15.5, 3 18, 5 18.5 C 8 19.2, 15 19.2, 19 17.5 C 22 16.2, 23.5 13.5, 23.5 11.5 C 23.5 11.5, 20 12.5, 16.5 10.5 L 12 5.5 C 11.5 5, 10.5 5, 9 6.5 L 6 7.5 C 4.5 8, 2.5 8.5, 2.5 10.5 V 12.5 Z"
        fill={fillColor}
        stroke={STROKE_COLOR}
        strokeWidth="0.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M2.5 10.5 L 3.5 9 L 2.8 8.5 C 2.5 9, 2.5 10, 2.5 10.5 Z" fill={STROKE_COLOR} opacity="0.8" />
      <path d="M2.8 15 C 8 16.5, 16 15.5, 23 11.8" fill="none" stroke={STROKE_COLOR} strokeWidth="0.5" opacity="0.6" />
      <g transform="skewX(-20)">
        <rect x="16" y="8" width="2.5" height="8" fill={STROKE_COLOR} rx="0.2" />
        <rect x="12.5" y="8.5" width="2.5" height="7" fill={STROKE_COLOR} rx="0.2" />
        <rect x="9" y="10" width="2.5" height="5" fill={STROKE_COLOR} rx="0.2" />
      </g>
      <path d="M9 6.5 L 10.5 8 L 12 7 L 13.5 8.5" stroke={STROKE_COLOR} strokeWidth="0.6" fill="none" strokeLinecap="round" />
    </g>
  );
}
export const SneakerMarker = memo(SneakerMarkerBase);


// -----------------------------------------------------------------------------
// 3. MOUNTAIN MARKER (High Fidelity)
// -----------------------------------------------------------------------------

function MountainMarkerBase({ fillColor, size = 'default' }: MarkerProps) {
  const isSmall = size === 'small';
  const transform = isSmall ? "translate(-8, -8) scale(0.6)" : "translate(-12, -12) scale(1)";

  return (
    <g transform={transform}>
      <path
        d="M2 21 L 8 8 L 12 2 L 15 6 L 18 5 L 22 21 Z"
        fill={fillColor}
        stroke={STROKE_COLOR}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 2 L 8 8 L 9.5 9 L 11 7.5 L 12.5 9.5 L 14 8 L 15 6 L 12 2"
        fill={STROKE_COLOR}
        opacity="0.9"
      />
      <path d="M12 2 L 12.5 21" stroke={STROKE_COLOR} strokeWidth="0.5" opacity="0.3" />
      <path d="M12 2 V -2" stroke={STROKE_COLOR} strokeWidth="1" />
      <path d="M12 -2 L 15 -0.5 L 12 1" fill={fillColor} stroke={STROKE_COLOR} strokeWidth="0.5" />
    </g>
  );
}
export const MountainMarker = memo(MountainMarkerBase);


// -----------------------------------------------------------------------------
// 4. F1 CAR MARKER (High Fidelity - Side View)
// -----------------------------------------------------------------------------

function F1CarMarkerBase({ fillColor, size = 'default' }: MarkerProps) {
  const isSmall = size === 'small';
  const transform = isSmall ? "translate(-8, -8) scale(0.6)" : "translate(-12, -12) scale(1)";

  return (
    <g transform={transform}>
      <path d="M19 4 L 22 4 L 22.5 9 L 20 9 Z" fill={fillColor} stroke={STROKE_COLOR} strokeWidth="0.8" />
      <path
        d="M1.5 13 Q 4 11, 6 11 L 10 8 L 12 5 Q 16 5, 20 11 L 21 14 H 6 Z"
        fill={fillColor}
        stroke={STROKE_COLOR}
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
      <path d="M9 9 Q 12 8, 13 9" fill="none" stroke={STROKE_COLOR} strokeWidth="1" strokeLinecap="round" />
      <path d="M0.5 13 L 4 13 L 3.5 11 Z" fill={fillColor} stroke={STROKE_COLOR} strokeWidth="0.6" />
      <circle cx="5" cy="13" r="3.5" fill={fillColor} stroke={STROKE_COLOR} strokeWidth="1.2" />
      <circle cx="19" cy="13" r="3.8" fill={fillColor} stroke={STROKE_COLOR} strokeWidth="1.2" />
      <circle cx="5" cy="13" r="1" fill={STROKE_COLOR} />
      <circle cx="19" cy="13" r="1" fill={STROKE_COLOR} />
    </g>
  );
}
export const F1CarMarker = memo(F1CarMarkerBase);


// -----------------------------------------------------------------------------
// 5. SPORT MARKERS (High Fidelity Stadiums)
// -----------------------------------------------------------------------------

function SportMarkerBase({ sport, fillColor, size = 'default' }: SportMarkerProps) {
  const isSmall = size === 'small';
  // All sports icons are designed on a 24x24 grid (r=12)
  // Scale them down to map marker size
  const transform = isSmall ? "translate(-5, -5) scale(0.42)" : "translate(-8, -8) scale(0.66)";
  const strokeWidth = 2;

  switch (sport) {
    case "Football": // Soccer
      return (
        <g transform={transform}>
          <circle cx="12" cy="12" r="11" fill={fillColor} stroke={STROKE_COLOR} strokeWidth={strokeWidth} />
          {/* Classic Pentagon Pattern */}
          <path
            d="M12 7 L 8 10 L 9.5 14.5 H 14.5 L 16 10 L 12 7 Z"
            fill={STROKE_COLOR}
            opacity="0.9"
          />
          {/* Lines to edge */}
          <path d="M12 7 V 1" stroke={STROKE_COLOR} strokeWidth={1.5} />
          <path d="M16 10 L 21 7" stroke={STROKE_COLOR} strokeWidth={1.5} />
          <path d="M14.5 14.5 L 19 20" stroke={STROKE_COLOR} strokeWidth={1.5} />
          <path d="M9.5 14.5 L 5 20" stroke={STROKE_COLOR} strokeWidth={1.5} />
          <path d="M8 10 L 3 7" stroke={STROKE_COLOR} strokeWidth={1.5} />
        </g>
      );

    case "American Football":
      return (
        <g transform={transform}>
          {/* Prolate Spheroid rotated 45 deg */}
          <ellipse
            cx="12" cy="12" rx="11" ry="7"
            transform="rotate(-45 12 12)"
            fill={fillColor}
            stroke={STROKE_COLOR}
            strokeWidth={strokeWidth}
          />
          {/* Stripes */}
          <path d="M8.5 5.5 L 5.5 8.5" stroke={STROKE_COLOR} strokeWidth={1.5} />
          <path d="M18.5 15.5 L 15.5 18.5" stroke={STROKE_COLOR} strokeWidth={1.5} />
          {/* Laces */}
          <path d="M9.5 9.5 L 14.5 14.5" stroke={STROKE_COLOR} strokeWidth={1.5} />
          <path d="M10.5 9 L 9 10.5" stroke={STROKE_COLOR} strokeWidth={1.5} />
          <path d="M11.5 10 L 10 11.5" stroke={STROKE_COLOR} strokeWidth={1.5} />
          <path d="M12.5 11 L 11 12.5" stroke={STROKE_COLOR} strokeWidth={1.5} />
          <path d="M13.5 12 L 12 13.5" stroke={STROKE_COLOR} strokeWidth={1.5} />
          <path d="M14.5 13 L 13 14.5" stroke={STROKE_COLOR} strokeWidth={1.5} />
        </g>
      );

    case "Baseball":
      return (
        <g transform={transform}>
          <circle cx="12" cy="12" r="11" fill={fillColor} stroke={STROKE_COLOR} strokeWidth={strokeWidth} />
          {/* Two Curved Lines */}
          <path d="M7 3 Q 12 12 7 21" fill="none" stroke={STROKE_COLOR} strokeWidth={1.5} />
          <path d="M17 3 Q 12 12 17 21" fill="none" stroke={STROKE_COLOR} strokeWidth={1.5} />
          {/* Stitch Marks */}
          <path d="M7 4 L 8 4" stroke={STROKE_COLOR} strokeWidth={1.5} strokeLinecap="round" />
          <path d="M8.5 6 L 9.5 6" stroke={STROKE_COLOR} strokeWidth={1.5} strokeLinecap="round" />
          <path d="M9.2 8 L 10.2 8" stroke={STROKE_COLOR} strokeWidth={1.5} strokeLinecap="round" />
          <path d="M9.5 10 L 10.5 10" stroke={STROKE_COLOR} strokeWidth={1.5} strokeLinecap="round" />
        </g>
      );

    case "Basketball":
      return (
        <g transform={transform}>
          <circle cx="12" cy="12" r="11" fill={fillColor} stroke={STROKE_COLOR} strokeWidth={strokeWidth} />
          {/* Ribs */}
          <path d="M12 1 V 23" stroke={STROKE_COLOR} strokeWidth={1.2} />
          <path d="M1 12 H 23" stroke={STROKE_COLOR} strokeWidth={1.2} />
          <path d="M22 7 C 18 12, 6 12, 2 7" fill="none" stroke={STROKE_COLOR} strokeWidth={1.2} />
          <path d="M22 17 C 18 12, 6 12, 2 17" fill="none" stroke={STROKE_COLOR} strokeWidth={1.2} />
        </g>
      );

    case "Hockey":
      return (
        <g transform={transform}>
           {/* Crossed Sticks */}
           <path
             d="M6 20 L 18 4 L 20 6 L 8 22 H 3 V 17 Z"
             fill={fillColor}
             stroke={STROKE_COLOR}
             strokeWidth="1.5"
             strokeLinejoin="round"
           />
           <path
             d="M18 20 L 6 4 L 4 6 L 16 22 H 21 V 17 Z"
             fill={fillColor}
             stroke={STROKE_COLOR}
             strokeWidth="1.5"
             strokeLinejoin="round"
           />
           {/* Puck */}
           <ellipse cx="12" cy="18" rx="3" ry="1.5" fill={STROKE_COLOR} />
        </g>
      );

    case "Tennis":
      return (
        <g transform={transform}>
          <circle cx="12" cy="12" r="11" fill={fillColor} stroke={STROKE_COLOR} strokeWidth={strokeWidth} />
          <path d="M4 4 Q 12 12 4 20" fill="none" stroke={STROKE_COLOR} strokeWidth={1.5} />
          <path d="M20 4 Q 12 12 20 20" fill="none" stroke={STROKE_COLOR} strokeWidth={1.5} />
        </g>
      );

    case "Cricket":
      return (
        <g transform={transform}>
           <circle cx="12" cy="12" r="11" fill={fillColor} stroke={STROKE_COLOR} strokeWidth={strokeWidth} />
           {/* Seam */}
           <path d="M8 3 Q 16 12 8 21" fill="none" stroke={STROKE_COLOR} strokeWidth={1.5} />
           <path d="M16 3 Q 8 12 16 21" fill="none" stroke={STROKE_COLOR} strokeWidth={1.5} />
           {/* Stitch marks in middle */}
           <path d="M10 5 L 14 5" stroke={STROKE_COLOR} strokeWidth={1} />
           <path d="M11 8 L 13 8" stroke={STROKE_COLOR} strokeWidth={1} />
           <path d="M11.5 12 L 12.5 12" stroke={STROKE_COLOR} strokeWidth={1} />
        </g>
      );

    default:
      // Generic Stadium (Flag)
      return (
        <g transform="translate(-9, -18)">
          <line x1="2" y1="3" x2="2" y2="18" stroke="#1e3a5f" strokeWidth="2" strokeLinecap="round" />
          <path
            d="M2 3C2 3 6 1 10 3C14 5 17 3 17 3V10C17 10 14 12 10 10C6 8 2 10 2 10V3Z"
            fill={fillColor}
            stroke={STROKE_COLOR}
            strokeWidth="1"
            strokeLinejoin="round"
          />
        </g>
      );
  }
}
export const SportMarker = memo(SportMarkerBase);

// -----------------------------------------------------------------------------
// 6. GENERIC MARKERS
// -----------------------------------------------------------------------------

function FlagMarkerBase({ fillColor, size = 'default' }: MarkerProps) {
  const isSmall = size === 'small';
  return isSmall ? (
    <g transform="translate(-4, -8)">
      <line x1="1" y1="1.5" x2="1" y2="8" stroke="#1e3a5f" strokeWidth="1" strokeLinecap="round" />
      <path
        d="M1 1.5C1 1.5 3 0.5 4.5 1.5C6 2.5 8 1.5 8 1.5V5C8 5 6 6 4.5 5C3 4 1 5 1 5V1.5Z"
        fill={fillColor}
        stroke={STROKE_COLOR}
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
        stroke={STROKE_COLOR}
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </g>
  );
}
export const FlagMarker = memo(FlagMarkerBase);

// -----------------------------------------------------------------------------
// 7. PARK MARKER (Pine Tree)
// -----------------------------------------------------------------------------

function ParkMarkerBase({ fillColor, size = 'default' }: MarkerProps) {
  const isSmall = size === 'small';
  const transform = isSmall ? "translate(-8, -8) scale(0.6)" : "translate(-12, -12) scale(1)";

  return (
    <g transform={transform}>
      {/* Tree trunk */}
      <rect x="10" y="18" width="4" height="5" fill="#8B4513" stroke={STROKE_COLOR} strokeWidth="0.5" />
      {/* Tree foliage - 3 tiers */}
      <path
        d="M12 2 L 6 10 L 8 10 L 4 16 L 9 16 L 9 18 L 15 18 L 15 16 L 20 16 L 16 10 L 18 10 Z"
        fill={fillColor}
        stroke={STROKE_COLOR}
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </g>
  );
}
export const ParkMarker = memo(ParkMarkerBase);

// -----------------------------------------------------------------------------
// 8. MUSEUM MARKER (Classical Building)
// -----------------------------------------------------------------------------

function MuseumMarkerBase({ fillColor, size = 'default' }: MarkerProps) {
  const isSmall = size === 'small';
  const transform = isSmall ? "translate(-8, -8) scale(0.6)" : "translate(-12, -12) scale(1)";

  return (
    <g transform={transform}>
      {/* Pediment (triangle roof) */}
      <path
        d="M12 2 L 3 8 L 21 8 Z"
        fill={fillColor}
        stroke={STROKE_COLOR}
        strokeWidth="1"
        strokeLinejoin="round"
      />
      {/* Frieze */}
      <rect x="3" y="8" width="18" height="2" fill={fillColor} stroke={STROKE_COLOR} strokeWidth="0.5" />
      {/* Pillars */}
      <rect x="4" y="10" width="2" height="10" fill={fillColor} stroke={STROKE_COLOR} strokeWidth="0.5" />
      <rect x="8" y="10" width="2" height="10" fill={fillColor} stroke={STROKE_COLOR} strokeWidth="0.5" />
      <rect x="14" y="10" width="2" height="10" fill={fillColor} stroke={STROKE_COLOR} strokeWidth="0.5" />
      <rect x="18" y="10" width="2" height="10" fill={fillColor} stroke={STROKE_COLOR} strokeWidth="0.5" />
      {/* Steps */}
      <rect x="2" y="20" width="20" height="2" fill={fillColor} stroke={STROKE_COLOR} strokeWidth="0.5" />
      <rect x="1" y="22" width="22" height="1" fill={fillColor} stroke={STROKE_COLOR} strokeWidth="0.3" />
    </g>
  );
}
export const MuseumMarker = memo(MuseumMarkerBase);

// -----------------------------------------------------------------------------
// 9. SKI MARKER (Skier)
// -----------------------------------------------------------------------------

function SkiMarkerBase({ fillColor, size = 'default' }: MarkerProps) {
  const isSmall = size === 'small';
  const transform = isSmall ? "translate(-8, -8) scale(0.6)" : "translate(-12, -12) scale(1)";

  return (
    <g transform={transform}>
      {/* Head */}
      <circle cx="14" cy="5" r="3" fill={fillColor} stroke={STROKE_COLOR} strokeWidth="1" />
      {/* Body (leaning forward) */}
      <path
        d="M14 8 L 10 16"
        stroke={fillColor}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M14 8 L 10 16"
        stroke={STROKE_COLOR}
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
      />
      {/* Arms with poles */}
      <path d="M12 10 L 6 8 L 5 14" stroke={fillColor} strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M12 10 L 18 8 L 19 14" stroke={fillColor} strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M12 10 L 6 8 L 5 14" stroke={STROKE_COLOR} strokeWidth="0.8" strokeLinecap="round" fill="none" />
      <path d="M12 10 L 18 8 L 19 14" stroke={STROKE_COLOR} strokeWidth="0.8" strokeLinecap="round" fill="none" />
      {/* Legs */}
      <path d="M10 16 L 6 20" stroke={fillColor} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M10 16 L 14 20" stroke={fillColor} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M10 16 L 6 20" stroke={STROKE_COLOR} strokeWidth="0.8" strokeLinecap="round" />
      <path d="M10 16 L 14 20" stroke={STROKE_COLOR} strokeWidth="0.8" strokeLinecap="round" />
      {/* Skis */}
      <path d="M3 21 L 9 19" stroke={fillColor} strokeWidth="2" strokeLinecap="round" />
      <path d="M11 21 L 17 19" stroke={fillColor} strokeWidth="2" strokeLinecap="round" />
      <path d="M3 21 L 9 19" stroke={STROKE_COLOR} strokeWidth="0.5" strokeLinecap="round" />
      <path d="M11 21 L 17 19" stroke={STROKE_COLOR} strokeWidth="0.5" strokeLinecap="round" />
    </g>
  );
}
export const SkiMarker = memo(SkiMarkerBase);

// -----------------------------------------------------------------------------
// 10. THEME PARK MARKER (Castle)
// -----------------------------------------------------------------------------

function ThemeParkMarkerBase({ fillColor, size = 'default' }: MarkerProps) {
  const isSmall = size === 'small';
  const transform = isSmall ? "translate(-8, -8) scale(0.6)" : "translate(-12, -12) scale(1)";

  return (
    <g transform={transform}>
      {/* Main tower */}
      <rect x="9" y="8" width="6" height="14" fill={fillColor} stroke={STROKE_COLOR} strokeWidth="0.8" />
      {/* Main tower top */}
      <path d="M8 8 L 12 2 L 16 8 Z" fill={fillColor} stroke={STROKE_COLOR} strokeWidth="0.8" />
      {/* Left tower */}
      <rect x="3" y="12" width="4" height="10" fill={fillColor} stroke={STROKE_COLOR} strokeWidth="0.8" />
      <path d="M2 12 L 5 7 L 8 12 Z" fill={fillColor} stroke={STROKE_COLOR} strokeWidth="0.8" />
      {/* Right tower */}
      <rect x="17" y="12" width="4" height="10" fill={fillColor} stroke={STROKE_COLOR} strokeWidth="0.8" />
      <path d="M16 12 L 19 7 L 22 12 Z" fill={fillColor} stroke={STROKE_COLOR} strokeWidth="0.8" />
      {/* Gate */}
      <path d="M10 22 L 10 17 Q 12 15, 14 17 L 14 22 Z" fill={STROKE_COLOR} opacity="0.8" />
      {/* Flag on main tower */}
      <line x1="12" y1="2" x2="12" y2="-1" stroke={STROKE_COLOR} strokeWidth="0.8" />
      <path d="M12 -1 L 15 0.5 L 12 2 Z" fill={fillColor} stroke={STROKE_COLOR} strokeWidth="0.3" />
    </g>
  );
}
export const ThemeParkMarker = memo(ThemeParkMarkerBase);

// -----------------------------------------------------------------------------
// 11. SURFING MARKER (Wave with Board)
// -----------------------------------------------------------------------------

function SurfingMarkerBase({ fillColor, size = 'default' }: MarkerProps) {
  const isSmall = size === 'small';
  const transform = isSmall ? "translate(-8, -8) scale(0.6)" : "translate(-12, -12) scale(1)";

  return (
    <g transform={transform}>
      {/* Wave */}
      <path
        d="M2 14 Q 6 8, 12 8 Q 18 8, 20 12 Q 22 16, 18 18 Q 14 20, 10 18 Q 6 16, 2 14 Z"
        fill={fillColor}
        stroke={STROKE_COLOR}
        strokeWidth="1"
      />
      {/* Wave curl/foam */}
      <path
        d="M18 12 Q 16 10, 12 10 Q 8 10, 6 12"
        fill="none"
        stroke={STROKE_COLOR}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Surfboard */}
      <ellipse
        cx="12" cy="16" rx="6" ry="1.5"
        transform="rotate(-15 12 16)"
        fill={STROKE_COLOR}
        stroke={fillColor}
        strokeWidth="0.5"
      />
    </g>
  );
}
export const SurfingMarker = memo(SurfingMarkerBase);

// -----------------------------------------------------------------------------
// 12. WEIRD MARKER (UFO)
// -----------------------------------------------------------------------------

function WeirdMarkerBase({ fillColor, size = 'default' }: MarkerProps) {
  const isSmall = size === 'small';
  const transform = isSmall ? "translate(-8, -8) scale(0.6)" : "translate(-12, -12) scale(1)";

  return (
    <g transform={transform}>
      {/* UFO dome */}
      <ellipse cx="12" cy="8" rx="5" ry="4" fill={fillColor} stroke={STROKE_COLOR} strokeWidth="0.8" />
      {/* UFO saucer */}
      <ellipse cx="12" cy="10" rx="10" ry="3" fill={fillColor} stroke={STROKE_COLOR} strokeWidth="1" />
      {/* Lights on saucer */}
      <circle cx="6" cy="10" r="1" fill={STROKE_COLOR} />
      <circle cx="12" cy="11" r="1" fill={STROKE_COLOR} />
      <circle cx="18" cy="10" r="1" fill={STROKE_COLOR} />
      {/* Beam */}
      <path
        d="M8 13 L 6 22 L 18 22 L 16 13"
        fill={fillColor}
        stroke={STROKE_COLOR}
        strokeWidth="0.5"
        opacity="0.5"
      />
      {/* Dome window */}
      <ellipse cx="12" cy="7" rx="2" ry="1.5" fill={STROKE_COLOR} opacity="0.6" />
    </g>
  );
}
export const WeirdMarker = memo(WeirdMarkerBase);

// Exports for backwards compatibility
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
export function renderAirplaneMarker(fillColor: string) {
  return <AirplaneMarker fillColor={fillColor} size="default" />;
}
