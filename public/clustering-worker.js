/**
 * Web Worker for marker clustering using Supercluster
 * Moves heavy clustering calculations off the main thread
 */

// Import supercluster via importScripts (for standalone worker)
// We'll inline a minimal supercluster implementation or load from CDN
importScripts('https://unpkg.com/supercluster@8.0.1/dist/supercluster.min.js');

let superclusterIndex = null;
let currentOptions = null;

/**
 * Initialize supercluster with markers
 */
function initializeClusters(markers, options) {
  const { radius = 60, maxZoom = 16, minPoints = 2 } = options;

  // Convert markers to GeoJSON features
  const features = markers.map(marker => ({
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

  // Create supercluster instance
  superclusterIndex = new Supercluster({
    radius,
    maxZoom,
    minPoints,
    // Custom reduce function to track dominant status in clusters
    map: (props) => ({
      visitedCount: props.status === 'visited' ? 1 : 0,
      bucketListCount: props.status === 'bucketList' ? 1 : 0,
    }),
    reduce: (accumulated, props) => {
      accumulated.visitedCount += props.visitedCount;
      accumulated.bucketListCount += props.bucketListCount;
    },
  });

  superclusterIndex.load(features);
  currentOptions = options;
}

/**
 * Get clusters for viewport
 */
function getClusters(zoom, bounds) {
  if (!superclusterIndex) {
    return [];
  }

  const bbox = bounds || [-180, -90, 180, 90];
  const clusterZoom = Math.floor(zoom);

  const rawClusters = superclusterIndex.getClusters(bbox, clusterZoom);

  // Transform clusters to add dominant status
  return rawClusters.map(feature => {
    if (feature.properties.cluster) {
      const props = feature.properties;
      const visitedCount = props.visitedCount || 0;
      const bucketListCount = props.bucketListCount || 0;

      let dominantStatus = 'unvisited';
      if (visitedCount >= bucketListCount && visitedCount > 0) {
        dominantStatus = 'visited';
      } else if (bucketListCount > 0) {
        dominantStatus = 'bucketList';
      }

      return {
        type: 'Feature',
        geometry: feature.geometry,
        properties: {
          cluster: true,
          cluster_id: props.cluster_id,
          point_count: props.point_count,
          point_count_abbreviated: props.point_count_abbreviated,
          dominantStatus,
        },
      };
    }

    return feature;
  });
}

/**
 * Get expansion zoom for a cluster
 */
function getClusterExpansionZoom(clusterId) {
  if (!superclusterIndex) return 16;
  return superclusterIndex.getClusterExpansionZoom(clusterId);
}

// Handle messages from main thread
self.onmessage = function(event) {
  const { type, payload, id } = event.data;

  switch (type) {
    case 'INIT': {
      const { markers, options } = payload;
      initializeClusters(markers, options);
      self.postMessage({ type: 'INIT_COMPLETE', id });
      break;
    }

    case 'GET_CLUSTERS': {
      const { zoom, bounds } = payload;
      const clusters = getClusters(zoom, bounds);
      self.postMessage({ type: 'CLUSTERS', payload: clusters, id });
      break;
    }

    case 'GET_EXPANSION_ZOOM': {
      const { clusterId } = payload;
      const expansionZoom = getClusterExpansionZoom(clusterId);
      self.postMessage({ type: 'EXPANSION_ZOOM', payload: expansionZoom, id });
      break;
    }

    default:
      console.warn('Unknown message type:', type);
  }
};
