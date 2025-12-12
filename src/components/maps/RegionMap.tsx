/**
 * RegionMap Component
 * Generic interactive map for region-based (country/state) coloring based on visit status
 * Follows DRY principle by unifying USMap and WorldMap logic
 */
'use client';

import { useCallback, memo } from 'react';
import { Geographies } from '@vnedyalk0v/react19-simple-maps';
import { Status, UserSelections, Selection } from '@/lib/types';
import { useStatusLookup } from '@/lib/hooks/useMapData';
import { TooltipHandlers } from './types';
import InteractiveMapShell from './InteractiveMapShell';
import { TappableGeography } from './TappableGeography';

// Strategy pattern: function to extract ID from geography properties
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IdExtractor = (geo: any) => string;

// Strategy pattern: function to get selection list from user selections
export type SelectionGetter = (selections: UserSelections) => Selection[] | undefined;

export interface RegionMapProps {
  selections: UserSelections;
  onToggle?: (id: string, currentStatus: Status) => void;
  tooltip: TooltipHandlers;
  // Configuration props
  geoUrl: string;
  projection: string;
  projectionConfig: Record<string, unknown>;
  width?: number;
  height?: number;
  viewBox?: string;
  initialCenter?: [number, number];
  maxZoom?: number;
  showSphere?: boolean;
  showGraticule?: boolean;
  // Strategy functions
  getId: IdExtractor;
  getSelections: SelectionGetter;
}

const RegionMap = memo(function RegionMap({
  selections,
  onToggle,
  tooltip,
  geoUrl,
  projection,
  projectionConfig,
  width = 800,
  height = 500,
  viewBox,
  initialCenter,
  maxZoom = 8,
  showSphere,
  showGraticule,
  getId,
  getSelections,
}: RegionMapProps) {
  // Use extracted hook for status lookup
  const statusMap = useStatusLookup(getSelections(selections));

  const getStatus = useCallback((id: string): Status => {
    return statusMap.get(id) || 'unvisited';
  }, [statusMap]);

  return (
    <InteractiveMapShell
      projection={projection}
      projectionConfig={projectionConfig}
      width={width}
      height={height}
      viewBox={viewBox || `0 0 ${width} ${height}`}
      initialCenter={initialCenter}
      maxZoom={maxZoom}
      showSphere={showSphere}
      showGraticule={showGraticule}
      className="w-full"
    >
      {() => (
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const id = getId(geo);
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

export default RegionMap;
