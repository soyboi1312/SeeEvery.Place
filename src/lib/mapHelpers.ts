/**
 * Map Helper Utilities
 * Pure utility functions for map data processing
 * Following SRP - generic utilities separate from domain-specific registry
 */

// Generic type for items with coordinates
export type CoordItem = { id: string; lat: number; lng: number; type?: string };

/**
 * Creates an O(1) lookup map from an array of items
 */
export function createLookupMap<T extends CoordItem>(items: T[]): Map<string, T> {
  return new Map(items.map(item => [item.id, item]));
}

// Country name to ISO code mapping - module-level constant to avoid GC churn
const countryCodeMap: Record<string, string> = {
  "France": "FR", "USA": "US", "United States": "US", "UK": "GB", "United Kingdom": "GB",
  "Germany": "DE", "Italy": "IT", "Spain": "ES", "Netherlands": "NL", "Austria": "AT",
  "Russia": "RU", "Japan": "JP", "Australia": "AU", "Brazil": "BR", "Argentina": "AR",
  "Mexico": "MX", "Canada": "CA", "Egypt": "EG", "South Africa": "ZA", "India": "IN",
  "China": "CN", "Thailand": "TH", "UAE": "AE", "Qatar": "QA", "Saudi Arabia": "SA",
  "Turkey": "TR", "Greece": "GR", "Portugal": "PT", "Belgium": "BE", "Switzerland": "CH",
  "Sweden": "SE", "Norway": "NO", "Denmark": "DK", "Finland": "FI", "Poland": "PL",
  "Czech Republic": "CZ", "Hungary": "HU", "Ireland": "IE", "New Zealand": "NZ",
  "Singapore": "SG", "Malaysia": "MY", "Indonesia": "ID", "South Korea": "KR",
  "Taiwan": "TW", "Colombia": "CO", "Peru": "PE", "Chile": "CL", "Ecuador": "EC",
  "England": "GB", "Scotland": "GB", "Wales": "GB", "Monaco": "MC",
  "Hong Kong": "HK", "Bahrain": "BH", "Azerbaijan": "AZ",
};

/**
 * Helper to get country code from country name
 */
export function getCountryCode(countryName: string): string {
  return countryCodeMap[countryName] || "";
}
