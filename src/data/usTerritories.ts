export interface USTerritory {
  code: string;
  name: string;
  region: string;
  capital: string;
  population: number;
}

export const usTerritories: USTerritory[] = [
  // Caribbean Territories
  { code: "PR", name: "Puerto Rico", region: "Caribbean", capital: "San Juan", population: 3221000 },
  { code: "VI", name: "U.S. Virgin Islands", region: "Caribbean", capital: "Charlotte Amalie", population: 87146 },

  // Pacific Territories
  { code: "GU", name: "Guam", region: "Pacific", capital: "Hagatna", population: 153836 },
  { code: "AS", name: "American Samoa", region: "Pacific", capital: "Pago Pago", population: 49710 },
  { code: "MP", name: "Northern Mariana Islands", region: "Pacific", capital: "Saipan", population: 47329 },

  // Minor Outlying Islands (Uninhabited or minimal population)
  { code: "UM-MID", name: "Midway Atoll", region: "Pacific Islands", capital: "N/A", population: 40 },
  { code: "UM-WAK", name: "Wake Island", region: "Pacific Islands", capital: "N/A", population: 100 },
  { code: "UM-JON", name: "Johnston Atoll", region: "Pacific Islands", capital: "N/A", population: 0 },
  { code: "UM-BAK", name: "Baker Island", region: "Pacific Islands", capital: "N/A", population: 0 },
  { code: "UM-HOW", name: "Howland Island", region: "Pacific Islands", capital: "N/A", population: 0 },
  { code: "UM-JAR", name: "Jarvis Island", region: "Pacific Islands", capital: "N/A", population: 0 },
  { code: "UM-KIN", name: "Kingman Reef", region: "Pacific Islands", capital: "N/A", population: 0 },
  { code: "UM-PAL", name: "Palmyra Atoll", region: "Pacific Islands", capital: "N/A", population: 20 },
  { code: "UM-NAV", name: "Navassa Island", region: "Caribbean", capital: "N/A", population: 0 },
];

export const regions = ["Caribbean", "Pacific", "Pacific Islands"];

export const getTerritoriesByRegion = (region: string) =>
  usTerritories.filter(t => t.region === region);

export const getTotalTerritories = () => usTerritories.length;
