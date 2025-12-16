/**
 * Hook for marker clustering using a Web Worker
 * Offloads heavy supercluster calculations to a separate thread
 * Falls back to main-thread clustering if Web Workers unavailable
 */
'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { MarkerData } from '@/lib/markerUtils';
import { Status } from '@/lib/types';
import {
  ClusterOrPoint,
  ClusterFeature,
  PointFeature,
  useMarkerClustering as useFallbackClustering,
} from './useMarkerClustering';

interface UseClusteringWorkerOptions {
  /** Enable/disable clustering (default: true if > 100 markers) */
  enabled?: boolean;
  /** Cluster radius in pixels (default: 60) */
  radius?: number;
  /** Maximum zoom level for clustering (default: 16) */
  maxZoom?: number;
  /** Minimum points to form a cluster (default: 2) */
  minPoints?: number;
}

// Message counter for request/response matching
let messageId = 0;

/**
 * Hook that clusters markers using a Web Worker for better performance
 * Falls back to main-thread clustering if workers unavailable
 */
export function useClusteringWorker(
  markers: MarkerData[],
  zoom: number,
  bounds?: [number, number, number, number],
  options: UseClusteringWorkerOptions = {}
) {
  const {
    enabled = markers.length > 100,
    radius = 60,
    maxZoom = 16,
    minPoints = 2,
  } = options;

  const workerRef = useRef<Worker | null>(null);
  const pendingRef = useRef<Map<number, (value: unknown) => void>>(new Map());
  const [workerSupported, setWorkerSupported] = useState(true);
  const [clusters, setClusters] = useState<ClusterOrPoint[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // OPTIMIZATION: Only pass markers to fallback if worker is NOT supported
  // This prevents the fallback hook from doing expensive O(N) mapping when worker handles it
  const fallbackMarkers = workerSupported ? [] : markers;

  // Fallback to main-thread clustering (only runs expensive ops when worker unavailable)
  const fallback = useFallbackClustering(
    fallbackMarkers,
    zoom,
    bounds,
    { enabled: !workerSupported && enabled, radius, maxZoom, minPoints }
  );

  // Initialize worker
  useEffect(() => {
    // Check for Web Worker support
    if (typeof Worker === 'undefined') {
      setWorkerSupported(false);
      return;
    }

    // Don't create worker if clustering is disabled
    if (!enabled) return;

    try {
      const worker = new Worker('/clustering-worker.js');

      worker.onmessage = (event) => {
        const { type, payload, id } = event.data;
        const resolver = pendingRef.current.get(id);

        switch (type) {
          case 'INIT_COMPLETE':
            setIsInitialized(true);
            resolver?.('initialized');
            pendingRef.current.delete(id);
            break;

          case 'CLUSTERS':
            setClusters(payload);
            resolver?.(payload);
            pendingRef.current.delete(id);
            break;

          case 'EXPANSION_ZOOM':
            resolver?.(payload);
            pendingRef.current.delete(id);
            break;
        }
      };

      worker.onerror = (error) => {
        console.warn('Clustering worker error, falling back to main thread:', error);
        setWorkerSupported(false);
        worker.terminate();
      };

      workerRef.current = worker;

      // Cleanup
      return () => {
        worker.terminate();
        workerRef.current = null;
        pendingRef.current.clear();
        setIsInitialized(false);
      };
    } catch {
      setWorkerSupported(false);
    }
  }, [enabled]);

  // Send message to worker with promise
  const sendMessage = useCallback((type: string, payload: unknown): Promise<unknown> => {
    return new Promise((resolve) => {
      if (!workerRef.current) {
        resolve(null);
        return;
      }

      const id = ++messageId;
      pendingRef.current.set(id, resolve);
      workerRef.current.postMessage({ type, payload, id });
    });
  }, []);

  // Initialize clustering when markers change
  useEffect(() => {
    if (!workerRef.current || !enabled || markers.length === 0) return;

    setIsInitialized(false);
    sendMessage('INIT', {
      markers: markers.map(m => ({
        id: m.id,
        coordinates: m.coordinates,
        status: m.status,
        sport: m.sport,
        parkType: m.parkType,
      })),
      options: { radius, maxZoom, minPoints },
    });
  }, [markers, enabled, radius, maxZoom, minPoints, sendMessage]);

  // Request clusters when zoom/bounds change
  useEffect(() => {
    if (!workerRef.current || !enabled || !isInitialized) return;

    sendMessage('GET_CLUSTERS', { zoom, bounds });
  }, [zoom, bounds, enabled, isInitialized, sendMessage]);

  // Get expansion zoom function
  const getClusterExpansionZoom = useCallback(async (clusterId: number): Promise<number> => {
    if (!workerRef.current || !isInitialized) return 16;
    const result = await sendMessage('GET_EXPANSION_ZOOM', { clusterId });
    return (result as number) || 16;
  }, [isInitialized, sendMessage]);

  // OPTIMIZATION: Only compute unclustered features when clustering is disabled
  // Avoids expensive O(N) mapping when worker is handling clustering
  const unclustered = useMemo<ClusterOrPoint[]>(() => {
    // Skip expensive mapping if clustering is enabled (worker will handle it)
    if (enabled) return [];

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
  }, [markers, enabled]);

  // Use fallback if worker not supported
  if (!workerSupported) {
    return fallback;
  }

  return {
    clusters: enabled ? clusters : unclustered,
    isClusteringEnabled: enabled,
    getClusterExpansionZoom,
  };
}

// Re-export type guard
export { isCluster } from './useMarkerClustering';
