/**
 * src/components/MapMarkers.tsx
 * Shared map marker SVG components.
 *
 * UPDATE: All specific category markers now render the unified 'LogoMarker'
 * to enforce consistent brand styling (Pin with Checkmark) across the map.
 *
 * OPTIMIZATION: Uses SVG <symbol> and <use> to avoid duplicating SVG path data
 * in the DOM for hundreds of markers. The symbols are defined once in
 * MarkerSymbolDefs and referenced by each marker instance.
 */

import { memo } from 'react';

export type MarkerSize = 'default' | 'small' | 'tiny';

interface MarkerProps {
  fillColor: string;
  size?: MarkerSize;
}

interface SportMarkerProps extends MarkerProps {
  sport?: string; // Made optional to match usage in some contexts
}

const STROKE_COLOR = "#ffffff";

// SVG path data for the marker (512x512 viewBox)
const PIN_PATH = "M256 32C158.8 32 80 110.8 80 208c0 40.3 13.7 78.6 38.3 112L256 480l137.7-160C418.3 286.6 432 248.3 432 208 432 110.8 353.2 32 256 32z";
const CHECK_PATH = "M236 228l-20-20-12 12 32 32 64-64-12-12-52 52z";

// -----------------------------------------------------------------------------
// MARKER SYMBOL DEFINITIONS
// Add this component inside ComposableMap to define reusable symbols
// -----------------------------------------------------------------------------

/**
 * SVG symbol definitions for map markers.
 * Must be rendered inside an SVG element (e.g., ComposableMap).
 * These symbols are referenced by LogoMarker using <use href="#symbol-id">.
 */
export const MarkerSymbolDefs = memo(function MarkerSymbolDefs() {
  return (
    <defs>
      {/* Pin outline symbol - the shape without fill for dynamic coloring */}
      <symbol id="marker-pin-path" viewBox="0 0 512 512">
        <path d={PIN_PATH} />
      </symbol>
      {/* Checkmark symbol */}
      <symbol id="marker-check-path" viewBox="0 0 512 512">
        <path d={CHECK_PATH} transform="translate(0, -10) scale(1.1)" />
      </symbol>
    </defs>
  );
});

// -----------------------------------------------------------------------------
// BRAND LOGO MARKER (Pin with Checkmark)
// Uses <use> to reference symbols, reducing DOM size for many markers
// -----------------------------------------------------------------------------

function LogoMarkerBase({ fillColor, size = 'default' }: MarkerProps) {
  // Scale down the 512x512 paths to fit the map marker size
  // Tiny: ~8px (high-density categories), Small: ~14px, Default: ~24px
  const scale = size === 'tiny' ? 0.016 : size === 'small' ? 0.028 : 0.046;

  // Calculate offsets to align the pin tip (256, 480) to the map coordinate (0, 0)
  // X: Center horizontally (-256 * scale)
  // Y: Align bottom tip (-480 * scale)
  const xOffset = -256 * scale;
  const yOffset = -480 * scale;

  return (
    <g transform={`translate(${xOffset}, ${yOffset})`}>
      <g transform={`scale(${scale})`}>
        {/* Pin Shape - uses symbol reference */}
        <use
          href="#marker-pin-path"
          fill={fillColor}
          stroke={STROKE_COLOR}
          strokeWidth="25"
          width="512"
          height="512"
        />
        {/* Checkmark - White (Stroke Color) */}
        <use
          href="#marker-check-path"
          fill={STROKE_COLOR}
          stroke="none"
          width="512"
          height="512"
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
