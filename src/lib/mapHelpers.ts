/**
 * Map Helper Utilities
 * Pure utility functions for map data processing
 * Following SRP - generic utilities separate from domain-specific registry
 */

import { countryCodeMap } from '@/data/countryMapping';

// Generic type for items with coordinates
export type CoordItem = { id: string; lat: number; lng: number; type?: string };

/**
 * Creates an O(1) lookup map from an array of items
 */
export function createLookupMap<T extends CoordItem>(items: T[]): Map<string, T> {
  return new Map(items.map(item => [item.id, item]));
}

/**
 * Helper to get country code from country name
 */
export function getCountryCode(countryName: string): string {
  return countryCodeMap[countryName] || "";
}
