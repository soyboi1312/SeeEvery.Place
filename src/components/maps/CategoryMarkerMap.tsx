/**
 * CategoryMarkerMap Component
 * Generic map with markers for category-specific locations
 * Follows DRY principle by unifying USMarkerMap and WorldMarkerMap logic
 * Follows ISP by using useCategoryMarkers hook for data fetching
 * Uses supercluster for marker clustering on large datasets (100+ markers)
 */
'use client';

import { memo, useState, useCallback } from 'react';
import { Geographies, Geography } from '@vnedyalk0v/react19-simple-maps';
import { useNameGetter, getMarkerSize, useCategoryMarkers } from '@/lib/hooks/useMapData';
import { useClusteringWorker, isCluster } from '@/lib/hooks/useClusteringWorker';
import { renderCategoryMarker } from '@/components/MapMarkers/registry';
import { MarkerMapProps, CategoryMarkerMapConfig } from './types';
import InteractiveMapShell from './InteractiveMapShell';
import MemoizedMarker from './MemoizedMarker';
import ClusterMarker from './ClusterMarker';

/**
 * Static background map component - memoized to prevent re-renders on zoom/pan
 * Generic version that accepts geoUrl as prop
 */
const StaticBackground = memo(function StaticBackground({ geoUrl }: { geoUrl: string }) {
  return (
    <Geographies geography={geoUrl}>
      {({ geographies }) =>
        geographies.map((geo) => (
          <Geography
            key={(geo as unknown as { rsmKey: string }).rsmKey}
            geography={geo}
            className="region-path unvisited outline-none focus:outline-none"
            style={{
              default: { outline: "none" },
              hover: { outline: "none" },
              pressed: { outline: "none" },
            }}
          />
        ))
      }
    </Geographies>
  );
});

export interface CategoryMarkerMapProps extends MarkerMapProps {
  config: CategoryMarkerMapConfig;
}

const CategoryMarkerMap = memo(function CategoryMarkerMap({
  category,
  selections,
  onToggle,
  subcategory,
  tooltip,
  items,
  config,
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
  } = config;

  // Track current zoom level for clustering
  const [currentZoom, setCurrentZoom] = useState(1);

  // Use extracted hook for data fetching - ISP/SRP
  const markers = useCategoryMarkers(category, selections, filterAlbersUsa, subcategory);

  // Use marker clustering for large datasets (>100 markers)
  // Web Worker offloads clustering to separate thread for better UI performance
  const { clusters, isClusteringEnabled, getClusterExpansionZoom } = useClusteringWorker(
    markers,
    currentZoom,
    undefined, // Use world bounds
    { enabled: markers.length > 100 }
  );

  // Use extracted hook for name lookup - DRY principle
  const getItemName = useNameGetter(items);

  // Handle zoom changes for clustering
  const handleZoomChange = useCallback((zoom: number) => {
    setCurrentZoom(zoom);
  }, []);

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
      className="w-full h-full"
      onZoomChange={handleZoomChange}
    >
      {({ zoom }) => {
        const markerSize = getMarkerSize(zoom);

        return (
          <>
            <StaticBackground geoUrl={geoUrl} />
            {isClusteringEnabled ? (
              // Render clustered markers
              clusters.map((feature, index) => {
                const [lng, lat] = feature.geometry.coordinates;

                if (isCluster(feature)) {
                  // Render cluster marker
                  return (
                    <ClusterMarker
                      key={`cluster-${feature.properties.cluster_id}`}
                      coordinates={[lng, lat]}
                      pointCount={feature.properties.point_count}
                      dominantStatus={feature.properties.dominantStatus}
                      size={markerSize}
                    />
                  );
                }

                // Render individual marker
                const props = feature.properties;
                const fillColor = props.status === 'visited' ? '#22c55e' : '#f59e0b';

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
                const fillColor = marker.status === 'visited' ? '#22c55e' : '#f59e0b';

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
  );
});

export default CategoryMarkerMap;
