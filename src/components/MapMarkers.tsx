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

// -----------------------------------------------------------------------------
// 1. AIRPLANE MARKER
// -----------------------------------------------------------------------------

function AirplaneMarkerBase({ fillColor, size = 'default' }: MarkerProps) {
  const isSmall = size === 'small';
  const transform = isSmall ? "translate(-8, -8) scale(0.6)" : "translate(-12, -12) scale(1)";
  const strokeColor = "#ffffff";

  return (
    <g transform={transform}>
      {/* Rear Wing (Horizontal Stabilizer) - Far side (peeking out) */}
      <path
        d="M17 11 L 21 9 L 22 10 L 19 12 Z"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="0.5"
      />

      {/* Main Fuselage */}
      <path
        d="M2 13
           Q 2 10, 5 9
           L 7 8
           L 16 8
           L 19 4
           L 22 4
           L 20.5 10
           Q 22 11, 22 12
           Q 22 14, 18 13.5
           L 10 13.5
           Q 2 14.5, 2 13 Z"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="0.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Cockpit Windows */}
      <path
        d="M5.5 9.5 L 7.5 9"
        stroke={strokeColor}
        strokeWidth="1"
        strokeLinecap="round"
      />

      {/* Tail Fin Rudder Line */}
      <path
        d="M19.5 5 L 18.5 9"
        stroke={strokeColor}
        strokeWidth="0.5"
        opacity="0.6"
      />

      {/* Main Wing */}
      <path
        d="M9 11
           L 14 17
           L 17 16
           L 15 11 Z"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="0.8"
        strokeLinejoin="round"
      />

      {/* Jet Engine */}
      <path
        d="M10 15
           L 10 16
           Q 10 17.5, 13 17
           L 13 16
           Q 13 15, 10 15 Z"
        fill={strokeColor}
        stroke={fillColor}
        strokeWidth="0.5"
      />

      {/* Engine Pylon (Connects engine to wing) */}
      <path
        d="M11.5 15 L 12.5 13"
        stroke={strokeColor}
        strokeWidth="0.8"
      />
    </g>
  );
}

export const AirplaneMarker = memo(AirplaneMarkerBase);

// -----------------------------------------------------------------------------
// 2. SPORT MARKER (Ball icons for stadiums)
// -----------------------------------------------------------------------------
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

// High-fidelity Adizero Evo SL inspired marker (25% larger for visibility)
function SneakerMarkerBase({ fillColor, size = 'default' }: MarkerProps) {
  const isSmall = size === 'small';
  // Scale up 25% for better visibility since there are fewer marathon locations
  const transform = isSmall ? "translate(-10, -10) scale(0.75)" : "translate(-15, -15) scale(1.25)";

  // Contrast color for the stripes (white usually looks best against the visited/bucket colors)
  const stripeColor = "#ffffff";

  return (
    <g transform={transform}>
      {/* Shoe Silhouette (Adizero Shape)
        Combined Upper and Midsole for a solid fill
      */}
      <path
        d="M2.5 12.5
           C 2.5 15.5, 3 18, 5 18.5
           C 8 19.2, 15 19.2, 19 17.5
           C 22 16.2, 23.5 13.5, 23.5 11.5
           C 23.5 11.5, 20 12.5, 16.5 10.5
           L 12 5.5
           C 11.5 5, 10.5 5, 9 6.5
           L 6 7.5
           C 4.5 8, 2.5 8.5, 2.5 10.5
           V 12.5 Z"
        fill={fillColor}
        stroke="#ffffff"
        strokeWidth="0.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Heel Tab Detail (The black patch on the back)
      */}
      <path
        d="M2.5 10.5 L 3.5 9 L 2.8 8.5 C 2.5 9, 2.5 10, 2.5 10.5 Z"
        fill={stripeColor}
        opacity="0.8"
      />

      {/* Midsole Separation Line
        Visualizes the thick foam stack
      */}
      <path
        d="M2.8 15 C 8 16.5, 16 15.5, 23 11.8"
        fill="none"
        stroke="#ffffff"
        strokeWidth="0.5"
        opacity="0.6"
      />

      {/* The Three Stripes
        Thick, diagonal, parallel, cut off at the midsole line
      */}
      <g transform="skewX(-20)">
        {/* Stripe 1 (Front) */}
        <rect x="16" y="8" width="2.5" height="8" fill={stripeColor} rx="0.2" />
        {/* Stripe 2 (Middle) */}
        <rect x="12.5" y="8.5" width="2.5" height="7" fill={stripeColor} rx="0.2" />
        {/* Stripe 3 (Rear) */}
        <rect x="9" y="10" width="2.5" height="5" fill={stripeColor} rx="0.2" />
      </g>

      {/* Laces Detail */}
      <path
        d="M9 6.5 L 10.5 8 L 12 7 L 13.5 8.5"
        stroke={stripeColor}
        strokeWidth="0.6"
        fill="none"
        strokeLinecap="round"
      />
    </g>
  );
}

export const SneakerMarker = memo(SneakerMarkerBase);

// High-fidelity Rugged Mountain with Snow Cap
function MountainMarkerBase({ fillColor, size = 'default' }: MarkerProps) {
  const isSmall = size === 'small';
  const strokeColor = "#ffffff";
  const transform = isSmall ? "translate(-8, -8) scale(0.6)" : "translate(-12, -12) scale(1)";

  return (
    <g transform={transform}>
      {/* Main Mountain Body (Jagged Rock) */}
      <path
        d="M2 21
           L 8 8
           L 12 2
           L 15 6
           L 18 5
           L 22 21
           Z"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Snow Cap (White peak) */}
      <path
        d="M12 2
           L 8 8
           L 9.5 9
           L 11 7.5
           L 12.5 9.5
           L 14 8
           L 15 6
           L 12 2"
        fill={strokeColor}
        opacity="0.9"
      />

      {/* Internal Ridge Line for Depth */}
      <path
        d="M12 2 L 12.5 21"
        stroke={strokeColor}
        strokeWidth="0.5"
        opacity="0.3"
      />

      {/* Summit Flag */}
      <path
        d="M12 2 V -2"
        stroke={strokeColor}
        strokeWidth="1"
      />
      <path
        d="M12 -2 L 15 -0.5 L 12 1"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="0.5"
      />
    </g>
  );
}

export const MountainMarker = memo(MountainMarkerBase);

// High-fidelity Modern F1 Car (Side View)
function F1CarMarkerBase({ fillColor, size = 'default' }: MarkerProps) {
  const isSmall = size === 'small';
  const strokeColor = "#ffffff";
  // Centered and scaled
  const transform = isSmall ? "translate(-8, -8) scale(0.6)" : "translate(-12, -12) scale(1)";

  return (
    <g transform={transform}>
      {/* F1 Side Profile (2025 Era)
         Features: Low nose, Halo, High Airbox, Raked Stance
      */}

      {/* Rear Wing (High and boxed) */}
      <path
        d="M19 4 L 22 4 L 22.5 9 L 20 9 Z"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="0.8"
      />

      {/* Main Body & Engine Cover */}
      <path
        d="M1.5 13
           Q 4 11, 6 11
           L 10 8
           L 12 5
           Q 16 5, 20 11
           L 21 14
           H 6 Z"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="0.8"
        strokeLinejoin="round"
      />

      {/* The Halo (Cockpit Protection - Distinct curved bar) */}
      <path
        d="M9 9 Q 12 8, 13 9"
        fill="none"
        stroke={strokeColor}
        strokeWidth="1"
        strokeLinecap="round"
      />

      {/* Front Wing (Multi-element) */}
      <path
        d="M0.5 13 L 4 13 L 3.5 11 Z"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="0.6"
      />

      {/* Wheels (Large Slicks) */}
      {/* Front Wheel */}
      <circle
        cx="5"
        cy="13"
        r="3.5"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="1.2"
      />
      {/* Rear Wheel (Slightly larger) */}
      <circle
        cx="19"
        cy="13"
        r="3.8"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="1.2"
      />

      {/* Wheel Rims (Inner detail) */}
      <circle cx="5" cy="13" r="1" fill={strokeColor} />
      <circle cx="19" cy="13" r="1" fill={strokeColor} />

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

export function renderAirplaneMarker(fillColor: string) {
  return <AirplaneMarker fillColor={fillColor} size="default" />;
}
