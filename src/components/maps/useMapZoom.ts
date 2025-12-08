/**
 * useMapZoom Hook
 * Provides controlled zoom state and handlers for map components
 */
import { useState, useCallback } from 'react';

export interface MapPosition {
  coordinates: [number, number];
  zoom: number;
}

interface UseMapZoomOptions {
  initialCenter?: [number, number];
  initialZoom?: number;
  minZoom?: number;
  maxZoom?: number;
  zoomFactor?: number;
}

export function useMapZoom({
  initialCenter = [0, 0],
  initialZoom = 1,
  minZoom = 1,
  maxZoom = 8,
  zoomFactor = 1.5,
}: UseMapZoomOptions = {}) {
  const [position, setPosition] = useState<MapPosition>({
    coordinates: initialCenter,
    zoom: initialZoom,
  });

  const handleZoomIn = useCallback(() => {
    setPosition((pos) => ({
      ...pos,
      zoom: Math.min(pos.zoom * zoomFactor, maxZoom),
    }));
  }, [zoomFactor, maxZoom]);

  const handleZoomOut = useCallback(() => {
    setPosition((pos) => ({
      ...pos,
      zoom: Math.max(pos.zoom / zoomFactor, minZoom),
    }));
  }, [zoomFactor, minZoom]);

  const handleMoveEnd = useCallback((newPosition: MapPosition) => {
    setPosition(newPosition);
  }, []);

  const handleReset = useCallback(() => {
    setPosition({ coordinates: initialCenter, zoom: initialZoom });
  }, [initialCenter, initialZoom]);

  const canZoomIn = position.zoom < maxZoom;
  const canZoomOut = position.zoom > minZoom;

  return {
    position,
    handleZoomIn,
    handleZoomOut,
    handleMoveEnd,
    handleReset,
    canZoomIn,
    canZoomOut,
  };
}
