/**
 * WorldMap Component
 * Interactive world map with country region coloring based on visit status
 */
'use client';

import { useCallback, useMemo, memo } from 'react';
import { ComposableMap, Geographies, ZoomableGroup, Sphere, Graticule } from '@vnedyalk0v/react19-simple-maps';
import { Status } from '@/lib/types';
import { GEO_URL_WORLD, countryNameToISO } from '@/lib/mapUtils';
import { BaseMapProps } from './types';
import { useMapZoom } from './useMapZoom';
import ZoomControls from './ZoomControls';
import { TappableGeography } from './TappableGeography';

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Library uses branded Longitude/Latitude types
const CENTER_ORIGIN: any = [0, 0];

const WorldMap = memo(function WorldMap({ selections, onToggle, tooltip }: BaseMapProps) {
  const {
    position,
    handleZoomIn,
    handleZoomOut,
    handleMoveEnd,
    canZoomIn,
    canZoomOut,
  } = useMapZoom({
    maxZoom: 8,
    initialCenter: [0, 0] // Center on equator
  });

  // Memoize status lookup for O(1) access instead of O(n) per geography
  const statusMap = useMemo(() => {
    const map = new Map<string, Status>();
    const countrySelections = selections.countries || [];
    for (const sel of countrySelections) {
      // Skip soft-deleted selections
      if (sel.deleted) continue;
      map.set(sel.id, sel.status);
    }
    return map;
  }, [selections.countries]);

  const getStatus = useCallback((id: string): Status => {
    return statusMap.get(id) || 'unvisited';
  }, [statusMap]);

  return (
    <div className="relative w-full h-full group">
      <ComposableMap
        projection="geoEqualEarth"
        projectionConfig={{ scale: 140, center: CENTER_ORIGIN }}
        width={800}
        height={400}
        viewBox="0 0 800 400"
        className="w-full h-full"
      >
        <ZoomableGroup
          zoom={position.zoom}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Library uses branded Longitude/Latitude types
          center={position.coordinates as any}
          onMoveEnd={handleMoveEnd}
          // Drag-to-pan enabled: D3 distinguishes clicks from drags automatically
        >
          <Sphere stroke="#E4E5E6" strokeWidth={0.5} id="sphere" fill="none" />
          <Graticule stroke="#E4E5E6" strokeWidth={0.5} />
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

export default WorldMap;
