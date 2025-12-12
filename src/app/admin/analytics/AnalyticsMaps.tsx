'use client';

import { useMemo } from 'react';
import { ComposableMap, Geographies, Geography, Sphere, Graticule } from '@vnedyalk0v/react19-simple-maps';
import { GEO_URL_USA, GEO_URL_WORLD, fipsToAbbr, countryNameToISO } from '@/lib/mapConstants';

// Type helper for center coordinates (library uses branded types)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CENTER_ORIGIN: any = [0, 0];

// Get heat color based on value relative to max
// Returns a blue gradient from light (low) to dark (high)
const getHeatColor = (value: number, max: number, isDarkMode: boolean) => {
  if (value === 0) {
    return isDarkMode ? '#1e293b' : '#f3f4f6'; // slate-800 / gray-100
  }

  // Calculate intensity (0.15 to 1.0 to ensure some visibility)
  const intensity = 0.15 + (0.85 * (value / max));

  // Use sky-500 as the base color with varying opacity
  return `rgba(14, 165, 233, ${intensity})`;
};

interface HeatmapData {
  id: string;
  timesVisited: number;
  timesBucketListed: number;
}

interface HeatmapProps {
  data: HeatmapData[];
  isDarkMode?: boolean;
}

// State abbreviation to full name for tooltips
const stateNames: Record<string, string> = {
  'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
  'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
  'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
  'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
  'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri',
  'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey',
  'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio',
  'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
  'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
  'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming',
  'DC': 'Washington D.C.'
};

export function AnalyticsUSMap({ data, isDarkMode = false }: HeatmapProps) {
  const { valueMap, maxValue } = useMemo(() => {
    const map = new Map<string, number>();
    let max = 0;
    data.forEach(item => {
      map.set(item.id, item.timesVisited);
      if (item.timesVisited > max) max = item.timesVisited;
    });
    return { valueMap: map, maxValue: max || 1 }; // Avoid division by zero
  }, [data]);

  return (
    <ComposableMap
      projection="geoAlbersUsa"
      projectionConfig={{ scale: 900 }}
      width={800}
      height={500}
      viewBox="0 50 800 450"
      className="w-full h-auto max-h-full"
      style={{ maxHeight: '100%' }}
    >
      <Geographies geography={GEO_URL_USA}>
        {({ geographies }) =>
          geographies.map((geo) => {
            // Ensure ID is a string and padded to 2 digits (e.g. 1 -> "01")
            const fips = String(geo.id).padStart(2, '0');
            const stateAbbr = fipsToAbbr[fips];
            const value = stateAbbr ? (valueMap.get(stateAbbr) || 0) : 0;
            const stateName = stateAbbr ? (stateNames[stateAbbr] || stateAbbr) : 'Unknown';

            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill={getHeatColor(value, maxValue, isDarkMode)}
                stroke={isDarkMode ? '#475569' : '#d1d5db'}
                strokeWidth={0.5}
                style={{
                  default: { outline: 'none' },
                  hover: {
                    fill: '#f59e0b',
                    outline: 'none',
                    cursor: 'pointer'
                  },
                  pressed: { outline: 'none' },
                }}
                data-tooltip-id="analytics-tooltip"
                data-tooltip-content={`${stateName}: ${value} visitors`}
              />
            );
          })
        }
      </Geographies>
    </ComposableMap>
  );
}

export function AnalyticsWorldMap({ data, isDarkMode = false }: HeatmapProps) {
  const { valueMap, maxValue } = useMemo(() => {
    const map = new Map<string, number>();
    let max = 0;
    data.forEach(item => {
      map.set(item.id, item.timesVisited);
      if (item.timesVisited > max) max = item.timesVisited;
    });
    return { valueMap: map, maxValue: max || 1 }; // Avoid division by zero
  }, [data]);

  return (
    <ComposableMap
      projection="geoEqualEarth"
      projectionConfig={{ scale: 140, center: CENTER_ORIGIN }}
      width={800}
      height={400}
      viewBox="0 0 800 400"
      className="w-full h-auto max-h-full"
      style={{ maxHeight: '100%' }}
    >
      <Sphere
        stroke={isDarkMode ? '#475569' : '#e4e5e6'}
        strokeWidth={0.5}
        id="analytics-sphere"
        fill="none"
      />
      <Graticule
        stroke={isDarkMode ? '#334155' : '#e4e5e6'}
        strokeWidth={0.3}
      />
      <Geographies geography={GEO_URL_WORLD}>
        {({ geographies }) =>
          geographies.map((geo) => {
            // Try multiple ways to match the country
            const countryName = geo.properties.name;
            const isoFromName = countryNameToISO[countryName];
            const isoFromProps = geo.properties['ISO_A2'];
            const countryCode = isoFromName || isoFromProps || String(geo.id);

            const value = countryCode ? (valueMap.get(countryCode) || 0) : 0;

            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill={getHeatColor(value, maxValue, isDarkMode)}
                stroke={isDarkMode ? '#475569' : '#d1d5db'}
                strokeWidth={0.5}
                style={{
                  default: { outline: 'none' },
                  hover: {
                    fill: '#f59e0b',
                    outline: 'none',
                    cursor: 'pointer'
                  },
                  pressed: { outline: 'none' },
                }}
                data-tooltip-id="analytics-tooltip"
                data-tooltip-content={`${countryName}: ${value} visitors`}
              />
            );
          })
        }
      </Geographies>
    </ComposableMap>
  );
}

// Color legend component
export function HeatmapLegend({ maxValue, isDarkMode = false }: { maxValue: number; isDarkMode?: boolean }) {
  return (
    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
      <span>0</span>
      <div
        className="w-24 h-3 rounded"
        style={{
          background: `linear-gradient(to right, ${isDarkMode ? '#1e293b' : '#f3f4f6'}, rgba(14, 165, 233, 1))`
        }}
      />
      <span>{maxValue}</span>
      <span className="ml-1">visitors</span>
    </div>
  );
}
