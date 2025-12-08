/**
 * StaticUSMap Component
 * Non-interactive US map for share card screenshots
 */
'use client';

import { ComposableMap, Geographies, Geography } from '@vnedyalk0v/react19-simple-maps';
import { UserSelections } from '@/lib/types';
import { getSelectionStatus } from '@/lib/storage';
import { GEO_URL_USA, fipsToAbbr } from '@/lib/mapUtils';

interface StaticUSMapProps {
  selections: UserSelections;
}

export default function StaticUSMap({ selections }: StaticUSMapProps) {
  return (
    <ComposableMap
      projection="geoAlbersUsa"
      projectionConfig={{ scale: 350 }}
      width={280}
      height={160}
      style={{ width: '100%', height: 'auto', maxWidth: '100%' }}
    >
      <Geographies geography={GEO_URL_USA}>
        {({ geographies }) =>
          geographies.map((geo) => {
            const fips = geo.id as string;
            const id = fipsToAbbr[fips];
            const status = id ? getSelectionStatus(selections, 'states', id) : 'unvisited';

            let fill = '#94a3b8'; // unvisited - slate gray
            if (status === 'visited') fill = '#22c55e'; // green
            if (status === 'bucketList') fill = '#f59e0b'; // amber

            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill={fill}
                stroke="#ffffff"
                strokeWidth={0.5}
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
