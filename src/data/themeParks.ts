export interface ThemePark {
  id: string;
  name: string;
  location: string;
  country: string;
  region: string;
  lat: number;
  lng: number;
  opened?: number; // year opened
}

// World's major theme parks by region
export const themeParks: ThemePark[] = [
  // North America - Disney Parks
  { id: "magic-kingdom", name: "Magic Kingdom", location: "Orlando, Florida", country: "USA", region: "North America", lat: 28.4177, lng: -81.5812, opened: 1971 },
  { id: "epcot", name: "EPCOT", location: "Orlando, Florida", country: "USA", region: "North America", lat: 28.3747, lng: -81.5494, opened: 1982 },
  { id: "hollywood-studios", name: "Hollywood Studios", location: "Orlando, Florida", country: "USA", region: "North America", lat: 28.3575, lng: -81.5583, opened: 1989 },
  { id: "animal-kingdom", name: "Animal Kingdom", location: "Orlando, Florida", country: "USA", region: "North America", lat: 28.3553, lng: -81.5901, opened: 1998 },
  { id: "disneyland", name: "Disneyland", location: "Anaheim, California", country: "USA", region: "North America", lat: 33.8121, lng: -117.9190, opened: 1955 },
  { id: "california-adventure", name: "Disney California Adventure", location: "Anaheim, California", country: "USA", region: "North America", lat: 33.8087, lng: -117.9187, opened: 2001 },

  // North America - Universal Parks
  { id: "universal-orlando", name: "Universal Studios Florida", location: "Orlando, Florida", country: "USA", region: "North America", lat: 28.4794, lng: -81.4685, opened: 1990 },
  { id: "islands-adventure", name: "Islands of Adventure", location: "Orlando, Florida", country: "USA", region: "North America", lat: 28.4722, lng: -81.4703, opened: 1999 },
  { id: "universal-hollywood", name: "Universal Studios Hollywood", location: "Los Angeles, California", country: "USA", region: "North America", lat: 34.1381, lng: -118.3534, opened: 1964 },

  // North America - Other Major Parks
  { id: "six-flags-magic-mountain", name: "Six Flags Magic Mountain", location: "Valencia, California", country: "USA", region: "North America", lat: 34.4252, lng: -118.5972, opened: 1971 },
  { id: "cedar-point", name: "Cedar Point", location: "Sandusky, Ohio", country: "USA", region: "North America", lat: 41.4781, lng: -82.6807, opened: 1870 },
  { id: "busch-gardens-tampa", name: "Busch Gardens Tampa Bay", location: "Tampa, Florida", country: "USA", region: "North America", lat: 28.0372, lng: -82.4214, opened: 1959 },
  { id: "legoland-california", name: "Legoland California", location: "Carlsbad, California", country: "USA", region: "North America", lat: 33.1267, lng: -117.3114, opened: 1999 },
  { id: "wonderland", name: "Canada's Wonderland", location: "Vaughan, Ontario", country: "Canada", region: "North America", lat: 43.8430, lng: -79.5393, opened: 1981 },

  // Asia - Japan
  { id: "tokyo-disneyland", name: "Tokyo Disneyland", location: "Urayasu, Chiba", country: "Japan", region: "Asia", lat: 35.6329, lng: 139.8804, opened: 1983 },
  { id: "tokyo-disneysea", name: "Tokyo DisneySea", location: "Urayasu, Chiba", country: "Japan", region: "Asia", lat: 35.6267, lng: 139.8850, opened: 2001 },
  { id: "universal-osaka", name: "Universal Studios Japan", location: "Osaka", country: "Japan", region: "Asia", lat: 34.6654, lng: 135.4323, opened: 2001 },

  // Asia - China
  { id: "shanghai-disneyland", name: "Shanghai Disneyland", location: "Shanghai", country: "China", region: "Asia", lat: 31.1434, lng: 121.6570, opened: 2016 },
  { id: "hong-kong-disneyland", name: "Hong Kong Disneyland", location: "Lantau Island", country: "Hong Kong", region: "Asia", lat: 22.3130, lng: 114.0413, opened: 2005 },
  { id: "chimelong-ocean", name: "Chimelong Ocean Kingdom", location: "Zhuhai, Guangdong", country: "China", region: "Asia", lat: 22.1044, lng: 113.5423, opened: 2014 },

  // Asia - Other
  { id: "everland", name: "Everland", location: "Yongin, Gyeonggi", country: "South Korea", region: "Asia", lat: 37.2933, lng: 127.2022, opened: 1976 },
  { id: "lotte-world", name: "Lotte World", location: "Seoul", country: "South Korea", region: "Asia", lat: 37.5111, lng: 127.0980, opened: 1989 },
  { id: "ocean-park", name: "Ocean Park Hong Kong", location: "Hong Kong", country: "Hong Kong", region: "Asia", lat: 22.2467, lng: 114.1749, opened: 1977 },

  // Europe
  { id: "disneyland-paris", name: "Disneyland Paris", location: "Marne-la-Vallée", country: "France", region: "Europe", lat: 48.8722, lng: 2.7758, opened: 1992 },
  { id: "walt-disney-studios", name: "Walt Disney Studios Park", location: "Marne-la-Vallée", country: "France", region: "Europe", lat: 48.8686, lng: 2.7807, opened: 2002 },
  { id: "europa-park", name: "Europa-Park", location: "Rust, Baden-Württemberg", country: "Germany", region: "Europe", lat: 48.2661, lng: 7.7220, opened: 1975 },
  { id: "efteling", name: "Efteling", location: "Kaatsheuvel", country: "Netherlands", region: "Europe", lat: 51.6500, lng: 5.0500, opened: 1952 },
  { id: "portaventura", name: "PortAventura World", location: "Salou, Tarragona", country: "Spain", region: "Europe", lat: 41.0862, lng: 1.1553, opened: 1995 },
  { id: "tivoli", name: "Tivoli Gardens", location: "Copenhagen", country: "Denmark", region: "Europe", lat: 55.6736, lng: 12.5681, opened: 1843 },
  { id: "alton-towers", name: "Alton Towers", location: "Staffordshire", country: "UK", region: "Europe", lat: 52.9880, lng: -1.8910, opened: 1980 },
  { id: "phantasialand", name: "Phantasialand", location: "Brühl", country: "Germany", region: "Europe", lat: 50.7989, lng: 6.8792, opened: 1967 },
  { id: "legoland-billund", name: "Legoland Billund", location: "Billund", country: "Denmark", region: "Europe", lat: 55.7352, lng: 9.1267, opened: 1968 },

  // Oceania
  { id: "dreamworld", name: "Dreamworld", location: "Gold Coast, Queensland", country: "Australia", region: "Oceania", lat: -27.8609, lng: 153.3134, opened: 1981 },
  { id: "movie-world", name: "Warner Bros. Movie World", location: "Gold Coast, Queensland", country: "Australia", region: "Oceania", lat: -27.9072, lng: 153.3159, opened: 1991 },

  // Middle East
  { id: "ferrari-world", name: "Ferrari World Abu Dhabi", location: "Yas Island", country: "UAE", region: "Middle East", lat: 24.4838, lng: 54.6073, opened: 2010 },
  { id: "img-worlds", name: "IMG Worlds of Adventure", location: "Dubai", country: "UAE", region: "Middle East", lat: 25.0467, lng: 55.2200, opened: 2016 },
];

export const themeParkRegions = ["North America", "Asia", "Europe", "Oceania", "Middle East"];

export const getThemeParksByRegion = (region: string) =>
  themeParks.filter(p => p.region === region);

export const getTotalThemeParks = () => themeParks.length;
