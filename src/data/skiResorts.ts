export interface SkiResort {
  id: string;
  name: string;
  location: string;
  country: string;
  region: string;
  lat: number;
  lng: number;
  verticalDrop?: number; // in meters
}

// World's top ski resorts by region
export const skiResorts: SkiResort[] = [
  // North America - USA
  { id: "vail", name: "Vail", location: "Colorado", country: "USA", region: "North America", lat: 39.6403, lng: -106.3742, verticalDrop: 1052 },
  { id: "aspen", name: "Aspen Snowmass", location: "Colorado", country: "USA", region: "North America", lat: 39.1869, lng: -106.8178, verticalDrop: 1343 },
  { id: "park-city", name: "Park City", location: "Utah", country: "USA", region: "North America", lat: 40.6514, lng: -111.5080, verticalDrop: 939 },
  { id: "jackson-hole", name: "Jackson Hole", location: "Wyoming", country: "USA", region: "North America", lat: 43.5875, lng: -110.8279, verticalDrop: 1262 },
  { id: "mammoth", name: "Mammoth Mountain", location: "California", country: "USA", region: "North America", lat: 37.6308, lng: -119.0326, verticalDrop: 914 },
  { id: "squaw-valley", name: "Palisades Tahoe", location: "California", country: "USA", region: "North America", lat: 39.1969, lng: -120.2358, verticalDrop: 853 },
  { id: "telluride", name: "Telluride", location: "Colorado", country: "USA", region: "North America", lat: 37.9375, lng: -107.8123, verticalDrop: 1168 },
  { id: "big-sky", name: "Big Sky", location: "Montana", country: "USA", region: "North America", lat: 45.2856, lng: -111.4019, verticalDrop: 1330 },
  { id: "deer-valley", name: "Deer Valley", location: "Utah", country: "USA", region: "North America", lat: 40.6375, lng: -111.4786, verticalDrop: 914 },
  { id: "steamboat", name: "Steamboat", location: "Colorado", country: "USA", region: "North America", lat: 40.4572, lng: -106.8045, verticalDrop: 1108 },
  { id: "breckenridge", name: "Breckenridge", location: "Colorado", country: "USA", region: "North America", lat: 39.4817, lng: -106.0384, verticalDrop: 1036 },
  { id: "alta-snowbird", name: "Alta / Snowbird", location: "Utah", country: "USA", region: "North America", lat: 40.5883, lng: -111.6372, verticalDrop: 988 },

  // North America - Canada
  { id: "whistler", name: "Whistler Blackcomb", location: "British Columbia", country: "Canada", region: "North America", lat: 50.1163, lng: -122.9574, verticalDrop: 1609 },
  { id: "banff", name: "Banff Sunshine", location: "Alberta", country: "Canada", region: "North America", lat: 51.0784, lng: -115.7587, verticalDrop: 1070 },
  { id: "lake-louise", name: "Lake Louise", location: "Alberta", country: "Canada", region: "North America", lat: 51.4254, lng: -116.1773, verticalDrop: 991 },
  { id: "mont-tremblant", name: "Mont Tremblant", location: "Quebec", country: "Canada", region: "North America", lat: 46.2094, lng: -74.5860, verticalDrop: 645 },

  // Europe - Alps
  { id: "zermatt", name: "Zermatt", location: "Valais", country: "Switzerland", region: "Europe", lat: 46.0207, lng: 7.7491, verticalDrop: 2200 },
  { id: "chamonix", name: "Chamonix Mont-Blanc", location: "Haute-Savoie", country: "France", region: "Europe", lat: 45.9237, lng: 6.8694, verticalDrop: 2807 },
  { id: "st-anton", name: "St. Anton", location: "Tyrol", country: "Austria", region: "Europe", lat: 47.1292, lng: 10.2684, verticalDrop: 1507 },
  { id: "val-disere", name: "Val d'Isère", location: "Savoie", country: "France", region: "Europe", lat: 45.4480, lng: 6.9808, verticalDrop: 1850 },
  { id: "verbier", name: "Verbier", location: "Valais", country: "Switzerland", region: "Europe", lat: 46.0966, lng: 7.2286, verticalDrop: 1500 },
  { id: "courchevel", name: "Courchevel", location: "Savoie", country: "France", region: "Europe", lat: 45.4151, lng: 6.6347, verticalDrop: 1472 },
  { id: "kitzbuhel", name: "Kitzbühel", location: "Tyrol", country: "Austria", region: "Europe", lat: 47.4497, lng: 12.3925, verticalDrop: 1200 },
  { id: "cortina", name: "Cortina d'Ampezzo", location: "Veneto", country: "Italy", region: "Europe", lat: 46.5369, lng: 12.1357, verticalDrop: 1024 },
  { id: "st-moritz", name: "St. Moritz", location: "Graubünden", country: "Switzerland", region: "Europe", lat: 46.4908, lng: 9.8355, verticalDrop: 1556 },
  { id: "lech", name: "Lech Zürs", location: "Vorarlberg", country: "Austria", region: "Europe", lat: 47.2075, lng: 10.1378, verticalDrop: 1100 },
  { id: "val-thorens", name: "Val Thorens", location: "Savoie", country: "France", region: "Europe", lat: 45.2983, lng: 6.5824, verticalDrop: 1230 },
  { id: "alpe-dhuez", name: "Alpe d'Huez", location: "Isère", country: "France", region: "Europe", lat: 45.0931, lng: 6.0698, verticalDrop: 2205 },
  { id: "ischgl", name: "Ischgl", location: "Tyrol", country: "Austria", region: "Europe", lat: 47.0105, lng: 10.2933, verticalDrop: 1512 },

  // Europe - Scandinavia
  { id: "are", name: "Åre", location: "Jämtland", country: "Sweden", region: "Europe", lat: 63.3988, lng: 13.0741, verticalDrop: 890 },

  // Asia
  { id: "niseko", name: "Niseko", location: "Hokkaido", country: "Japan", region: "Asia", lat: 42.8048, lng: 140.6874, verticalDrop: 940 },
  { id: "hakuba", name: "Hakuba Valley", location: "Nagano", country: "Japan", region: "Asia", lat: 36.6987, lng: 137.8619, verticalDrop: 1071 },

  // Oceania
  { id: "queenstown", name: "The Remarkables", location: "Otago", country: "New Zealand", region: "Oceania", lat: -45.0427, lng: 168.8283, verticalDrop: 418 },
  { id: "thredbo", name: "Thredbo", location: "New South Wales", country: "Australia", region: "Oceania", lat: -36.5035, lng: 148.3035, verticalDrop: 672 },

  // South America
  { id: "portillo", name: "Portillo", location: "Valparaíso", country: "Chile", region: "South America", lat: -32.8375, lng: -70.1286, verticalDrop: 800 },
  { id: "valle-nevado", name: "Valle Nevado", location: "Santiago", country: "Chile", region: "South America", lat: -33.3539, lng: -70.2564, verticalDrop: 810 },
  { id: "bariloche", name: "Cerro Catedral", location: "Río Negro", country: "Argentina", region: "South America", lat: -41.1667, lng: -71.4333, verticalDrop: 1030 },
];

export const skiResortRegions = ["North America", "Europe", "Asia", "Oceania", "South America"];

export const getSkiResortsByRegion = (region: string) =>
  skiResorts.filter(r => r.region === region);

export const getTotalSkiResorts = () => skiResorts.length;
