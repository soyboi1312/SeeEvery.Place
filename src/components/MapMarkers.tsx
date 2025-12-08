/**
 * src/components/MapMarkers.tsx
 * Shared map marker SVG components.
 * * UPDATE: All specific category markers now render the unified 'LogoMarker'
 * to enforce consistent brand styling (Pin with Checkmark) across the map.
 */

import { memo } from 'react';

export type MarkerSize = 'default' | 'small';

interface MarkerProps {
  fillColor: string;
  size?: MarkerSize;
}

interface SportMarkerProps extends MarkerProps {
  sport?: string; // Made optional to match usage in some contexts
}

const STROKE_COLOR = "#ffffff";

// -----------------------------------------------------------------------------
// BRAND LOGO MARKER (Pin with Checkmark)
// -----------------------------------------------------------------------------

function LogoMarkerBase({ fillColor, size = 'default' }: MarkerProps) {
  // Scale down the 512x512 paths to fit the map marker size
  // Small: ~14px, Default: ~24px
  const scale = size === 'small' ? 0.028 : 0.046;
  
  // Calculate offsets to align the pin tip (256, 480) to the map coordinate (0, 0)
  // X: Center horizontally (-256 * scale)
  // Y: Align bottom tip (-480 * scale)
  const xOffset = -256 * scale;
  const yOffset = -480 * scale;

  return (
    <g transform={`translate(${xOffset}, ${yOffset})`}>
      <g transform={`scale(${scale})`}>
        {/* Pin Shape - Tip is at 256, 480 */}
        <path
          d="M256 32C158.8 32 80 110.8 80 208c0 40.3 13.7 78.6 38.3 112L256 480l137.7-160C418.3 286.6 432 248.3 432 208 432 110.8 353.2 32 256 32z"
          fill={fillColor}
          stroke={STROKE_COLOR}
          strokeWidth="25"
        />
        {/* Checkmark - White (Stroke Color) */}
        <path
          d="M236 228l-20-20-12 12 32 32 64-64-12-12-52 52z"
          fill={STROKE_COLOR}
          transform="translate(0, -10) scale(1.1)"
          stroke="none"
        />
      </g>
    </g>
  );
}

// The main export for the brand marker
export const LogoMarker = memo(LogoMarkerBase);

// -----------------------------------------------------------------------------
// UNIFIED COMPONENT EXPORTS
// All legacy marker names now point to LogoMarker for consistency.
// -----------------------------------------------------------------------------

// 1. SportMarker (Handles the 'sport' prop by ignoring it and passing rest)
export const SportMarker = memo(({ fillColor, size }: SportMarkerProps) => (
  <LogoMarker fillColor={fillColor} size={size} />
));

// 2. Standard Category Markers
export const AirplaneMarker = memo((props: MarkerProps) => <LogoMarker {...props} />);
export const SneakerMarker = memo((props: MarkerProps) => <LogoMarker {...props} />);
export const MountainMarker = memo((props: MarkerProps) => <LogoMarker {...props} />);
export const F1CarMarker = memo((props: MarkerProps) => <LogoMarker {...props} />);
export const FlagMarker = memo((props: MarkerProps) => <LogoMarker {...props} />);
export const ParkMarker = memo((props: MarkerProps) => <LogoMarker {...props} />);
export const MuseumMarker = memo((props: MarkerProps) => <LogoMarker {...props} />);
export const SkiMarker = memo((props: MarkerProps) => <LogoMarker {...props} />);
export const ThemeParkMarker = memo((props: MarkerProps) => <LogoMarker {...props} />);
export const SurfingMarker = memo((props: MarkerProps) => <LogoMarker {...props} />);
export const WeirdMarker = memo((props: MarkerProps) => <LogoMarker {...props} />);

// -----------------------------------------------------------------------------
// HELPER FUNCTIONS (Deprecated but kept for compatibility)
// -----------------------------------------------------------------------------

export function renderSportMarker(sport: string | undefined, fillColor: string) {
  return <LogoMarker fillColor={fillColor} size="default" />;
}

export function renderSneakerMarker(fillColor: string) {
  return <LogoMarker fillColor={fillColor} size="default" />;
}

export function renderMountainMarker(fillColor: string) {
  return <LogoMarker fillColor={fillColor} size="default" />;
}

export function renderF1CarMarker(fillColor: string) {
  return <LogoMarker fillColor={fillColor} size="default" />;
}

export function renderAirplaneMarker(fillColor: string) {
  return <LogoMarker fillColor={fillColor} size="default" />;
}
