/**
 * Hook for clustering map markers using supercluster
 * Used to improve performance when rendering many markers (cities, weird americana, etc.)
 */
import { useMemo } from 'react';
import Supercluster from 'supercluster';
import { MarkerData } from '@/lib/markerUtils';
import { Status } from '@/lib/types';

// Cluster properties
export interface ClusterProperties {
  cluster: true;
  cluster_id: number;
  point_count: number;
  point_count_abbreviated: string;
  // Aggregate status (majority status in cluster)
  dominantStatus: Status;
}

// Individual point properties
export interface PointProperties {
  cluster: false;
  id: string;
  status: Status;
  sport?: string;
  parkType?: string;
}

// GeoJSON Feature types
export type ClusterFeature = GeoJSON.Feature<GeoJSON.Point, ClusterProperties>;
export type PointFeature = GeoJSON.Feature<GeoJSON.Point, PointProperties>;
export type ClusterOrPoint = ClusterFeature | PointFeature;

interface UseMarkerClusteringOptions {
  /** Enable/disable clustering (default: true if > 100 markers) */
  enabled?: boolean;
  /** Cluster radius in pixels (default: 60) */
  radius?: number;
  /** Maximum zoom level for clustering (default: 16) */
  maxZoom?: number;
  /** Minimum points to form a cluster (default: 2) */
  minPoints?: number;
}

/**
 * Hook that clusters markers based on zoom level
 * Returns either clustered data or original markers depending on zoom and marker count
 */
export function useMarkerClustering(
  markers: MarkerData[],
  zoom: number,
  bounds?: [number, number, number, number], // [west, south, east, north]
  options: UseMarkerClusteringOptions = {}
) {
  const {
    enabled = markers.length > 100,
    radius = 60,
    maxZoom = 16,
    minPoints = 2,
  } = options;

  // Create supercluster index
  const superclusterIndex = useMemo(() => {
    if (!enabled) return null;

    // Convert markers to GeoJSON features
    const features: GeoJSON.Feature<GeoJSON.Point, PointProperties>[] = markers.map(marker => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: marker.coordinates,
      },
      properties: {
        cluster: false,
        id: marker.id,
        status: marker.status,
        sport: marker.sport,
        parkType: marker.parkType,
      },
    }));

    // Create and load supercluster
    // Note: map/reduce return a custom accumulator type, not ClusterProperties
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const index = new Supercluster<PointProperties, any>({
      radius,
      maxZoom,
      minPoints,
      // Custom reduce function to track dominant status in clusters
      map: (props) => ({
        visitedCount: props.status === 'visited' ? 1 : 0,
        bucketListCount: props.status === 'bucketList' ? 1 : 0,
      }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      reduce: (accumulated: any, props: any) => {
        accumulated.visitedCount += props.visitedCount;
        accumulated.bucketListCount += props.bucketListCount;
      },
    });

    index.load(features);
    return index;
  }, [markers, enabled, radius, maxZoom, minPoints]);

  // Get clusters for current viewport
  const clusters = useMemo<ClusterOrPoint[]>(() => {
    if (!enabled || !superclusterIndex) {
      // Return original markers as point features when clustering is disabled
      return markers.map(marker => ({
        type: 'Feature' as const,
        geometry: {
          type: 'Point' as const,
          coordinates: marker.coordinates,
        },
        properties: {
          cluster: false as const,
          id: marker.id,
          status: marker.status,
          sport: marker.sport,
          parkType: marker.parkType,
        },
      }));
    }

    // Use provided bounds or world bounds
    const bbox = bounds || [-180, -90, 180, 90];
    const clusterZoom = Math.floor(zoom);

    const rawClusters = superclusterIndex.getClusters(bbox, clusterZoom);

    // Transform clusters to add dominant status
    return rawClusters.map(feature => {
      if (feature.properties.cluster) {
        // It's a cluster - determine dominant status
        const props = feature.properties as {
          cluster: true;
          cluster_id: number;
          point_count: number;
          point_count_abbreviated: string;
          visitedCount?: number;
          bucketListCount?: number;
        };

        const visitedCount = props.visitedCount || 0;
        const bucketListCount = props.bucketListCount || 0;

        let dominantStatus: Status = 'unvisited';
        if (visitedCount >= bucketListCount && visitedCount > 0) {
          dominantStatus = 'visited';
        } else if (bucketListCount > 0) {
          dominantStatus = 'bucketList';
        }

        return {
          type: 'Feature' as const,
          geometry: feature.geometry,
          properties: {
            cluster: true as const,
            cluster_id: props.cluster_id,
            point_count: props.point_count,
            point_count_abbreviated: props.point_count_abbreviated,
            dominantStatus,
          },
        } as ClusterFeature;
      }

      // It's a regular point
      return feature as PointFeature;
    });
  }, [markers, superclusterIndex, zoom, bounds, enabled]);

  // Function to get children of a cluster (for drill-down)
  const getClusterExpansionZoom = useMemo(() => {
    if (!superclusterIndex) return () => 16;
    return (clusterId: number) => superclusterIndex.getClusterExpansionZoom(clusterId);
  }, [superclusterIndex]);

  return {
    clusters,
    isClusteringEnabled: enabled,
    getClusterExpansionZoom,
  };
}

/**
 * Type guard to check if a feature is a cluster
 */
export function isCluster(feature: ClusterOrPoint): feature is ClusterFeature {
  return feature.properties.cluster === true;
}
