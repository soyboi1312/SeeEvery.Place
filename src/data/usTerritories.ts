export interface USTerritory {
  code: string;
  name: string;
  region: string;
  capital: string;
  population: number;
  lat: number;
  lng: number;
}

export const usTerritories: USTerritory[] = [
  // Federal District
  { code: "DC", name: "District of Columbia", region: "Federal District", capital: "Washington", population: 689545, lat: 38.9072, lng: -77.0369 },

  // Caribbean Territories
  { code: "PR", name: "Puerto Rico", region: "Caribbean", capital: "San Juan", population: 3221000, lat: 18.2208, lng: -66.5901 },
  { code: "VI", name: "U.S. Virgin Islands", region: "Caribbean", capital: "Charlotte Amalie", population: 87146, lat: 18.3358, lng: -64.8963 },

  // Pacific Territories
  { code: "GU", name: "Guam", region: "Pacific", capital: "Hagatna", population: 153836, lat: 13.4443, lng: 144.7937 },
  { code: "AS", name: "American Samoa", region: "Pacific", capital: "Pago Pago", population: 49710, lat: -14.2710, lng: -170.1322 },
  { code: "MP", name: "Northern Mariana Islands", region: "Pacific", capital: "Saipan", population: 47329, lat: 15.0979, lng: 145.6739 },

  // Minor Outlying Islands (Uninhabited or minimal population)
  { code: "UM-MID", name: "Midway Atoll", region: "Pacific Islands", capital: "N/A", population: 40, lat: 28.2072, lng: -177.3735 },
  { code: "UM-WAK", name: "Wake Island", region: "Pacific Islands", capital: "N/A", population: 100, lat: 19.2823, lng: 166.6470 },
  { code: "UM-JON", name: "Johnston Atoll", region: "Pacific Islands", capital: "N/A", population: 0, lat: 16.7295, lng: -169.5336 },
  { code: "UM-BAK", name: "Baker Island", region: "Pacific Islands", capital: "N/A", population: 0, lat: 0.1936, lng: -176.4769 },
  { code: "UM-HOW", name: "Howland Island", region: "Pacific Islands", capital: "N/A", population: 0, lat: 0.8113, lng: -176.6183 },
  { code: "UM-JAR", name: "Jarvis Island", region: "Pacific Islands", capital: "N/A", population: 0, lat: -0.3744, lng: -159.9967 },
  { code: "UM-KIN", name: "Kingman Reef", region: "Pacific Islands", capital: "N/A", population: 0, lat: 6.3833, lng: -162.4167 },
  { code: "UM-PAL", name: "Palmyra Atoll", region: "Pacific Islands", capital: "N/A", population: 20, lat: 5.8885, lng: -162.0787 },
  { code: "UM-NAV", name: "Navassa Island", region: "Caribbean", capital: "N/A", population: 0, lat: 18.4100, lng: -75.0115 },
];

export const regions = ["Federal District", "Caribbean", "Pacific", "Pacific Islands"];

export const getTerritoriesByRegion = (region: string) =>
  usTerritories.filter(t => t.region === region);

export const getTotalTerritories = () => usTerritories.length;
