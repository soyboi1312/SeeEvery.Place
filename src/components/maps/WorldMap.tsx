/**
 * WorldMap Component
 * Interactive world map with country region coloring based on visit status
 */
'use client';

import { useCallback, useMemo, memo } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup, Sphere, Graticule } from '@vnedyalk0v/react19-simple-maps';
import { Status } from '@/lib/types';
import { GEO_URL_WORLD, countryNameToISO } from '@/lib/mapUtils';
import { BaseMapProps } from './types';
import { useMapZoom } from './useMapZoom';
import ZoomControls from './ZoomControls';

// Type helper for center coordinates (library uses branded types)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CENTER_ORIGIN: any = [0, 0];

const WorldMap = memo(function WorldMap({ selections, onToggle, tooltip }: BaseMapProps) {
  const {
    position,
    handleZoomIn,
    handleZoomOut,
    handleMoveEnd,
    canZoomIn,
    canZoomOut,
  } = useMapZoom({ maxZoom: 8 });

  // Memoize status lookup for O(1) access instead of O(n) per geography
  const statusMap = useMemo(() => {
    const map = new Map<string, Status>();
    const countrySelections = selections.countries || [];
    for (const sel of countrySelections) {
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
        projectionConfig={{ scale: 160, center: CENTER_ORIGIN }}
        className="w-full h-full"
      >
        <ZoomableGroup
          zoom={position.zoom}
          center={position.coordinates as any}
          onMoveEnd={handleMoveEnd}
        >
          <Sphere stroke="#E4E5E6" strokeWidth={0.5} id="sphere" fill="none" />
          <Graticule stroke="#E4E5E6" strokeWidth={0.5} />
          <Geographies geography={GEO_URL_WORLD}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const countryName = geo.properties.name;
                const id = countryNameToISO[countryName] || geo.properties["ISO_A2"] || geo.id;
                const status = id ? getStatus(id) : 'unvisited';
                const statusClass = status === 'bucketList' ? 'bucket-list' : status;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    className={`region-path ${statusClass} outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500`}
                    style={{
                      default: { outline: "none" },
                      hover: { outline: "none", filter: "brightness(0.9)" },
                      pressed: { outline: "none" },
                    }}
                    data-tip={countryName}
                    tabIndex={0}
                    role="button"
                    aria-label={`${countryName}, ${status === 'visited' ? 'visited' : status === 'bucketList' ? 'on bucket list' : 'not visited'}`}
                    onClick={() => {
                      if (id && onToggle) {
                        onToggle(id, status);
                      }
                    }}
                    onKeyDown={(e) => {
                      if ((e.key === 'Enter' || e.key === ' ') && id && onToggle) {
                        e.preventDefault();
                        onToggle(id, status);
                      }
                    }}
                    onMouseEnter={(e) => tooltip.onMouseEnter(countryName, e)}
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
