/**
 * CategoryMarkerMap Component
 * Generic map with markers for category-specific locations
 * Follows DRY principle by unifying USMarkerMap and WorldMarkerMap logic
 * Follows ISP by using useCategoryMarkers hook for data fetching
 * Uses supercluster for marker clustering on large datasets (500+ markers)
 */
'use client';

import { memo, useState, useCallback, useRef } from 'react';
import { Geographies } from '@vnedyalk0v/react19-simple-maps';
import { useNameGetter, getMarkerSize, useCategoryMarkers } from '@/lib/hooks/useMapData';
import { useClusteringWorker, isCluster } from '@/lib/hooks/useClusteringWorker';
import { renderCategoryMarker } from '@/components/MapMarkers/registry';
import { MarkerMapProps, CategoryMarkerMapConfig, IdExtractor } from './types';
import { RegionFilter, StatusVisibility } from '@/lib/markerUtils';
import InteractiveMapShell from './InteractiveMapShell';
import MemoizedMarker from './MemoizedMarker';
import ClusterMarker from './ClusterMarker';
import { TappableGeography } from './TappableGeography';
import { Status } from '@/lib/types';

// Define colors for all marker states
const STATUS_COLORS: Record<Status, string> = {
  visited: '#22c55e',    // Green
  bucketList: '#f59e0b', // Amber
  unvisited: '#94a3b8'   // Slate-400 (Grey)
};

/**
 * Interactive background map component - memoized to prevent re-renders on zoom/pan
 * Uses TappableGeography to enable click-to-navigate on background regions
 */
interface InteractiveBackgroundProps {
  geoUrl: string;
  getId?: IdExtractor;
  onRegionClick?: (id: string) => void;
}

const InteractiveBackground = memo(function InteractiveBackground({
  geoUrl,
  getId,
  onRegionClick
}: InteractiveBackgroundProps) {
  // Adapter to match TappableGeography's onToggle signature
  const handleToggle = useCallback((id: string) => {
    onRegionClick?.(id);
  }, [onRegionClick]);

  // No-op tooltip handlers for background regions (tooltips handled by markers)
  const noOpHandlers = {
    onMouseEnter: () => {},
    onMouseLeave: () => {},
    onMouseMove: () => {},
  };

  return (
    <Geographies geography={geoUrl}>
      {({ geographies }) =>
        geographies.map((geo) => {
          const id = getId ? getId(geo) : '';
          const name = geo.properties?.name || '';

          return (
            <TappableGeography
              key={(geo as unknown as { rsmKey: string }).rsmKey}
              geo={geo}
              id={id}
              status="unvisited"
              name={name}
              onToggle={onRegionClick ? handleToggle : undefined}
              {...noOpHandlers}
            />
          );
        })
      }
    </Geographies>
  );
});

export interface CategoryMarkerMapProps extends MarkerMapProps {
  config: CategoryMarkerMapConfig;
  onRegionClick?: (id: string) => void; // Handler for background region clicks
  regionFilter?: RegionFilter; // Filter markers to a specific state/country
  statusVisibility?: StatusVisibility; // Filter markers by status (clicked legend items)
}

const CategoryMarkerMap = memo(function CategoryMarkerMap({
  category,
  selections,
  onToggle,
  subcategory,
  tooltip,
  items,
  config,
  onRegionClick,
  regionFilter,
  statusVisibility,
}: CategoryMarkerMapProps) {
  const {
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
    filterAlbersUsa = false,
    getId,
  } = config;

  // Track current zoom level for clustering
  const [currentZoom, setCurrentZoom] = useState(1);

  // Track drag state to prevent accidental navigation when panning the map
  // If user clicks, drags, and releases, we don't want to trigger region click
  const isDraggingRef = useRef(false);

  // Wrap onRegionClick to only fire if not dragging
  const handleRegionClickSafe = useCallback((id: string) => {
    if (!isDraggingRef.current) {
      onRegionClick?.(id);
    }
  }, [onRegionClick]);

  // Use extracted hook for data fetching - ISP/SRP
  // Pass regionFilter to only show markers in the specified state/country
  // statusVisibility filters markers by status (clicked legend items)
  const { markers, isLoading } = useCategoryMarkers(category, selections, filterAlbersUsa, subcategory, regionFilter, statusVisibility);

  // Use marker clustering for large datasets (>500 markers)
  // 500 SVG markers are trivial for modern browsers; clustering only needed for very dense datasets
  // Web Worker offloads clustering to separate thread for better UI performance
  const { clusters, isClusteringEnabled, getClusterExpansionZoom } = useClusteringWorker(
    markers,
    currentZoom,
    undefined, // Use world bounds
    { enabled: markers.length > 500 }
  );

  // Use extracted hook for name lookup - DRY principle
  const getItemName = useNameGetter(items);

  // Handle zoom changes for clustering
  const handleZoomChange = useCallback((zoom: number) => {
    setCurrentZoom(zoom);
  }, []);

  return (
    <div
      className="relative w-full h-full"
      // Track pointer movement to detect drags vs clicks
      onPointerDown={() => { isDraggingRef.current = false; }}
      onPointerMove={() => { isDraggingRef.current = true; }}
    >
      {/* Loading overlay - shown while category data is fetching */}
      {isLoading && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-100/80 dark:bg-slate-900/80 backdrop-blur-sm animate-pulse">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Loading map data...
            </span>
          </div>
        </div>
      )}
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
      className="w-full h-full"
      onZoomChange={handleZoomChange}
    >
      {({ zoom, zoomTo }) => {
        const markerSize = getMarkerSize(zoom);

        return (
          <>
            <InteractiveBackground geoUrl={geoUrl} getId={getId} onRegionClick={handleRegionClickSafe} />
            {isClusteringEnabled ? (
              // Render clustered markers
              clusters.map((feature, index) => {
                const [lng, lat] = feature.geometry.coordinates;

                if (isCluster(feature)) {
                  // Render cluster marker with click-to-zoom functionality
                  const clusterId = feature.properties.cluster_id;
                  const handleClusterClick = async () => {
                    const expansionZoom = await getClusterExpansionZoom(clusterId);
                    zoomTo([lng, lat], expansionZoom);
                  };

                  return (
                    <ClusterMarker
                      key={`cluster-${clusterId}`}
                      coordinates={[lng, lat]}
                      pointCount={feature.properties.point_count}
                      dominantStatus={feature.properties.dominantStatus}
                      size={markerSize}
                      onClick={handleClusterClick}
                    />
                  );
                }

                // Render individual marker
                const props = feature.properties;
                const fillColor = STATUS_COLORS[props.status as Status] || STATUS_COLORS.unvisited;

                return (
                  <MemoizedMarker
                    key={props.id}
                    id={props.id}
                    coordinates={[lng, lat]}
                    status={props.status}
                    name={getItemName(props.id)}
                    size={markerSize}
                    onToggle={onToggle}
                    onMouseEnter={tooltip.onMouseEnter}
                    onMouseLeave={tooltip.onMouseLeave}
                    onMouseMove={tooltip.onMouseMove}
                  >
                    {renderCategoryMarker(category, fillColor, markerSize, props.sport)}
                  </MemoizedMarker>
                );
              })
            ) : (
              // Render unclustered markers (original behavior for small datasets)
              markers.map((marker) => {
                const fillColor = STATUS_COLORS[marker.status] || STATUS_COLORS.unvisited;

                return (
                  <MemoizedMarker
                    key={marker.id}
                    id={marker.id}
                    coordinates={marker.coordinates}
                    status={marker.status}
                    name={getItemName(marker.id)}
                    size={markerSize}
                    onToggle={onToggle}
                    onMouseEnter={tooltip.onMouseEnter}
                    onMouseLeave={tooltip.onMouseLeave}
                    onMouseMove={tooltip.onMouseMove}
                  >
                    {renderCategoryMarker(category, fillColor, markerSize, marker.sport)}
                  </MemoizedMarker>
                );
              })
            )}
          </>
        );
      }}
    </InteractiveMapShell>
    </div>
  );
});

export default CategoryMarkerMap;
