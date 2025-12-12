/**
 * USMap Component
 * Interactive US map with state region coloring based on visit status
 * Includes territory indicators for PR, VI, GU, AS, MP which can't be shown on Albers USA projection
 */
'use client';

import { useCallback, useMemo, memo } from 'react';
import { ComposableMap, Geographies, ZoomableGroup } from '@vnedyalk0v/react19-simple-maps';
import { Status } from '@/lib/types';
import { GEO_URL_USA, fipsToAbbr } from '@/lib/mapUtils';
import { BaseMapProps } from './types';
import { useMapZoom } from './useMapZoom';
import ZoomControls from './ZoomControls';
import { TappableGeography } from './TappableGeography';

const USMap = memo(function USMap({ selections, onToggle, tooltip }: BaseMapProps) {
  const {
    position,
    handleZoomIn,
    handleZoomOut,
    handleMoveEnd,
    canZoomIn,
    canZoomOut,
  } = useMapZoom({
    maxZoom: 8,
    initialCenter: [-97, 38] // Center on the US
  });

  // Memoize status lookup for O(1) access instead of O(n) per geography
  const statusMap = useMemo(() => {
    const map = new Map<string, Status>();
    const stateSelections = selections.states || [];
    for (const sel of stateSelections) {
      // Skip soft-deleted selections
      if (sel.deleted) continue;
      map.set(sel.id, sel.status);
    }
    return map;
  }, [selections.states]);

  const getStatus = useCallback((id: string): Status => {
    return statusMap.get(id) || 'unvisited';
  }, [statusMap]);

  return (
    <div className="relative w-full group">
      <ComposableMap
        projection="geoAlbersUsa"
        projectionConfig={{ scale: 1000 }}
        width={800}
        height={500}
        viewBox="0 0 800 500"
        className="w-full"
      >
        <ZoomableGroup
          zoom={position.zoom}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Library uses branded Longitude/Latitude types
          center={position.coordinates as any}
          onMoveEnd={handleMoveEnd}
          // Drag-to-pan enabled: D3 distinguishes clicks from drags automatically
        >
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
        </ZoomableGroup>
      </ComposableMap>
      <ZoomControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        canZoomIn={canZoomIn}
        canZoomOut={canZoomOut}
      />
    </div>
  );
});

export default USMap;
