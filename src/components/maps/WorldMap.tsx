/**
 * WorldMap Component
 * Interactive world map with country region coloring based on visit status
 */
'use client';

import { useCallback, memo } from 'react';
import { Geographies } from '@vnedyalk0v/react19-simple-maps';
import { Status } from '@/lib/types';
import { GEO_URL_WORLD, countryNameToISO } from '@/lib/mapConstants';
import { useStatusLookup } from '@/lib/hooks/useMapData';
import { BaseMapProps } from './types';
import InteractiveMapShell from './InteractiveMapShell';
import { TappableGeography } from './TappableGeography';

const WorldMap = memo(function WorldMap({ selections, onToggle, tooltip }: BaseMapProps) {
  // Use extracted hook for status lookup - DRY principle
  const statusMap = useStatusLookup(selections.countries);

  const getStatus = useCallback((id: string): Status => {
    return statusMap.get(id) || 'unvisited';
  }, [statusMap]);

  return (
    <InteractiveMapShell
      projection="geoEqualEarth"
      projectionConfig={{ scale: 140, center: [0, 0] }}
      width={800}
      height={400}
      viewBox="0 0 800 400"
      initialCenter={[0, 0]}
      maxZoom={8}
      showSphere
      showGraticule
      className="w-full"
    >
      {() => (
        <Geographies geography={GEO_URL_WORLD}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const countryName = geo.properties.name;
              const id = countryNameToISO[countryName] || geo.properties["ISO_A2"] || String(geo.id);
              const status = id ? getStatus(id) : 'unvisited';

              return (
                <TappableGeography
                  key={geo.rsmKey}
                  geo={geo}
                  id={id}
                  status={status}
                  name={countryName}
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

export default WorldMap;
