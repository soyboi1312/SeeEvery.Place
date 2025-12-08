/**
 * StaticWorldMap Component
 * Non-interactive world map for share card screenshots
 */
'use client';

import { ComposableMap, Geographies, Geography, Sphere, Graticule } from '@vnedyalk0v/react19-simple-maps';
import { UserSelections } from '@/lib/types';
import { getSelectionStatus } from '@/lib/storage';
import { GEO_URL_WORLD, countryNameToISO } from '@/lib/mapUtils';

// Type helper for center coordinates (library uses branded types)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CENTER_ORIGIN: any = [0, 10]; // Centered on 10°N for balanced view of all continents

interface StaticWorldMapProps {
  selections: UserSelections;
}

export default function StaticWorldMap({ selections }: StaticWorldMapProps) {
  return (
    <ComposableMap
      projection="geoEqualEarth"
      projectionConfig={{ scale: 140, center: CENTER_ORIGIN }}
      viewBox="0 0 800 400"
      width={800}
      height={400}
      style={{ width: '100%', height: 'auto', maxWidth: '100%' }}
    >
      <Sphere stroke="#ffffff" strokeWidth={0.5} id="sphere-share" fill="#1e3a5f" />
      <Graticule stroke="#ffffff" strokeWidth={0.2} strokeOpacity={0.3} />
      <Geographies geography={GEO_URL_WORLD}>
        {({ geographies }) =>
          geographies.map((geo) => {
            const countryName = geo.properties.name;
            const id = countryNameToISO[countryName] || geo.properties["ISO_A2"] || geo.id;
            const status = id ? getSelectionStatus(selections, 'countries', id) : 'unvisited';

            let fill = '#94a3b8'; // unvisited - slate gray
            if (status === 'visited') fill = '#22c55e'; // green
            if (status === 'bucketList') fill = '#f59e0b'; // amber

            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill={fill}
                stroke="#ffffff"
                strokeWidth={0.3}
                style={{
                  default: { outline: "none" },
                  hover: { outline: "none" },
                  pressed: { outline: "none" },
                }}
              />
            );
          })
        }
      </Geographies>
    </ComposableMap>
  );
}
