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
import { usTerritories } from '@/data/usTerritories';

// Territory data for the inset - only the main 5 inhabited territories
const territories = usTerritories.filter(t => ['PR', 'VI', 'GU', 'AS', 'MP'].includes(t.code));

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

  const getStatus = useCallback((id: string): Status => {
    return statusMap.get(id) || 'unvisited';
  }, [statusMap]);

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

      {/* US Territories Inset - these can't be shown on Albers USA projection */}
      <div className="absolute bottom-2 left-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg p-2 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
          Territories
        </div>
        <div className="flex flex-wrap gap-1.5">
          {territories.map((territory) => {
            const status = getStatus(territory.code);
            const statusClass = status === 'visited'
              ? 'bg-green-500 text-white'
              : status === 'bucketList'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300';

            return (
              <button
                key={territory.code}
                onClick={() => onToggle?.(territory.code, status)}
                onMouseEnter={(e) => tooltip.onMouseEnter(territory.name, e)}
                onMouseLeave={tooltip.onMouseLeave}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer hover:opacity-80 ${statusClass}`}
                aria-label={`${territory.name}, ${status === 'visited' ? 'visited' : status === 'bucketList' ? 'on bucket list' : 'not visited'}`}
              >
                {territory.code}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
});

export default USMap;
