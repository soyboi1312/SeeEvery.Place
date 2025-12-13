/**
 * Shared types for map components
 */
import { Category, UserSelections, Status } from '@/lib/types';

// Simple item interface for name lookups
export interface ItemWithName {
  id: string;
  name: string;
}

export interface TooltipState {
  content: string;
  x: number;
  y: number;
}

export interface TooltipHandlers {
  onMouseEnter: (content: string, e: React.MouseEvent) => void;
  onMouseLeave: () => void;
  onMouseMove: (e: React.MouseEvent) => void;
}

export interface BaseMapProps {
  selections: UserSelections;
  onToggle?: (id: string, currentStatus: Status) => void;
  tooltip: TooltipHandlers;
}

export interface MarkerMapProps extends BaseMapProps {
  category: Category;
  subcategory?: string;
  items?: ItemWithName[];
}

export interface MapVisualizationProps {
  category: Category;
  selections: UserSelections;
  onToggle?: (id: string, currentStatus: Status) => void;
  subcategory?: string;
  items?: ItemWithName[]; // Items for name lookups (optional, falls back to ID)
}

// =====================
// Configuration Interfaces (DRY - centralized)
// =====================

export interface CategoryMarkerMapConfig {
  geoUrl: string;
  projection: string;
  projectionConfig: Record<string, unknown>;
  width?: number;
  height?: number;
  viewBox?: string;
  initialCenter?: [number, number];
  maxZoom?: number;
  showSphere?: boolean;
  showGraticule?: boolean;
  filterAlbersUsa?: boolean;
}

// Strategy pattern: function to extract ID from geography properties
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IdExtractor = (geo: any) => string;

// Strategy pattern: function to get selection list from user selections
export type SelectionGetter = (selections: UserSelections) => import('@/lib/types').Selection[] | undefined;

export interface RegionMapConfig {
  geoUrl: string;
  projection: string;
  projectionConfig: Record<string, unknown>;
  width: number;
  height: number;
  viewBox: string;
  initialCenter: [number, number];
  maxZoom: number;
  showSphere?: boolean;
  showGraticule?: boolean;
  getId: IdExtractor;
  getSelections: SelectionGetter;
}
