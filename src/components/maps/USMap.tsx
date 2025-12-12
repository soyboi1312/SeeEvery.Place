/**
 * USMap Component
 * Interactive US map with state region coloring based on visit status
 * Includes territory indicators for PR, VI, GU, AS, MP which can't be shown on Albers USA projection
 */
'use client';

import { useCallback, memo } from 'react';
import { Geographies } from '@vnedyalk0v/react19-simple-maps';
import { Status } from '@/lib/types';
import { GEO_URL_USA, fipsToAbbr } from '@/lib/mapConstants';
import { useStatusLookup } from '@/lib/hooks/useMapData';
import { BaseMapProps } from './types';
import InteractiveMapShell from './InteractiveMapShell';
import { TappableGeography } from './TappableGeography';

const USMap = memo(function USMap({ selections, onToggle, tooltip }: BaseMapProps) {
  // Use extracted hook for status lookup - DRY principle
  const statusMap = useStatusLookup(selections.states);

  const getStatus = useCallback((id: string): Status => {
    return statusMap.get(id) || 'unvisited';
  }, [statusMap]);

  return (
    <InteractiveMapShell
      projection="geoAlbersUsa"
      projectionConfig={{ scale: 1000 }}
      width={800}
      height={500}
      viewBox="0 0 800 500"
      initialCenter={[-97, 38]}
      maxZoom={8}
      className="w-full"
    >
      {() => (
        <Geographies geography={GEO_URL_USA}>
          {({ geographies }) =>
            geographies.map((geo) => {
              // Ensure ID is a string and padded to 2 digits (e.g. 1 -> "01")
              const fips = String(geo.id).padStart(2, '0');
              const id = fipsToAbbr[fips];
              const name = geo.properties.name;
              const status = id ? getStatus(id) : 'unvisited';

              return (
                <TappableGeography
                  key={geo.rsmKey}
                  geo={geo}
                  id={id}
                  status={status}
                  name={name}
                  onToggle={onToggle}
                  onMouseEnter={tooltip.onMouseEnter}
                  onMouseLeave={tooltip.onMouseLeave}
                  onMouseMove={tooltip.onMouseMove}
                />
              );
            })
          }
        </Geographies>
      )}
    </InteractiveMapShell>
  );
});

export default USMap;
