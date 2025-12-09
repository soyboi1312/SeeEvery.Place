/**
 * USMap Component
 * Interactive US map with state region coloring based on visit status
 * Includes territory indicators for PR, VI, GU, AS, MP which can't be shown on Albers USA projection
 */
'use client';

import { useCallback, useMemo, memo } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from '@vnedyalk0v/react19-simple-maps';
import { Status } from '@/lib/types';
import { GEO_URL_USA, fipsToAbbr } from '@/lib/mapUtils';
import { BaseMapProps } from './types';
import { useMapZoom } from './useMapZoom';
import ZoomControls from './ZoomControls';

// Territory marker positions - approximate geographic locations
// These are positioned to show near their actual locations on the world map
const territoryMarkers: { code: string; name: string; coordinates: [number, number] }[] = [
  { code: "PR", name: "Puerto Rico", coordinates: [-66.5, 18.2] },
  { code: "VI", name: "U.S. Virgin Islands", coordinates: [-64.9, 18.3] },
  { code: "GU", name: "Guam", coordinates: [144.8, 13.4] },
  { code: "AS", name: "American Samoa", coordinates: [-170.1, -14.3] },
  { code: "MP", name: "Northern Mariana Islands", coordinates: [145.7, 15.1] },
];

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
      map.set(sel.id, sel.status);
    }
    return map;
  }, [selections.states]);

  // Territory status lookup
  const territoryStatusMap = useMemo(() => {
    const map = new Map<string, Status>();
    const territorySelections = selections.territories || [];
    for (const sel of territorySelections) {
      if (!sel.deleted) {
        map.set(sel.id, sel.status);
      }
    }
    return map;
  }, [selections.territories]);

  const getStatus = useCallback((id: string): Status => {
    return statusMap.get(id) || 'unvisited';
  }, [statusMap]);

  const getTerritoryStatus = useCallback((id: string): Status => {
    return territoryStatusMap.get(id) || 'unvisited';
  }, [territoryStatusMap]);

  // Get territories that have been marked (visited or bucket list)
  const markedTerritories = useMemo(() => {
    return territoryMarkers.filter(t => {
      const status = territoryStatusMap.get(t.code);
      return status === 'visited' || status === 'bucketList';
    });
  }, [territoryStatusMap]);

  return (
    <div className="relative w-full h-full group">
      <ComposableMap
        projection="geoAlbersUsa"
        projectionConfig={{ scale: 1000 }}
        className="w-full h-full"
      >
        <ZoomableGroup
          zoom={position.zoom}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Library uses branded Longitude/Latitude types
          center={position.coordinates as any}
          onMoveEnd={handleMoveEnd}
          filterZoomEvent={(evt: Event) => {
            // Only allow zoom/pan with ctrl/cmd key or touch events
            // Regular clicks should pass through to Geography elements
            if ('touches' in evt) return true; // Allow touch zoom
            if ('deltaY' in evt) return true; // Allow wheel zoom
            return (evt as MouseEvent).ctrlKey || (evt as MouseEvent).metaKey;
          }}
        >
          <Geographies geography={GEO_URL_USA}>
            {({ geographies }) =>
              geographies.map((geo) => {
                // Ensure ID is a string and padded to 2 digits (e.g. 1 -> "01")
                const fips = String(geo.id).padStart(2, '0');
                const id = fipsToAbbr[fips];
                const name = geo.properties.name;
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
                    data-tip={name}
                    tabIndex={0}
                    role="button"
                    aria-label={`${name}, ${status === 'visited' ? 'visited' : status === 'bucketList' ? 'on bucket list' : 'not visited'}`}
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
                    onMouseEnter={(e) => tooltip.onMouseEnter(name, e)}
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

      {/* Territory markers - shown as overlay since they're outside Albers USA projection */}
      {markedTerritories.length > 0 && (
        <div className="absolute bottom-2 left-2 flex flex-wrap gap-1.5 max-w-[200px]">
          {markedTerritories.map((territory) => {
            const status = getTerritoryStatus(territory.code);
            const isVisited = status === 'visited';

            return (
              <div
                key={territory.code}
                className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium shadow-md backdrop-blur-sm"
                style={{
                  backgroundColor: isVisited ? 'rgba(34, 197, 94, 0.9)' : 'rgba(245, 158, 11, 0.9)',
                  color: 'white',
                }}
                onMouseEnter={(e) => tooltip.onMouseEnter(territory.name, e)}
                onMouseLeave={tooltip.onMouseLeave}
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                {territory.code}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
});

export default USMap;
