export interface UNESCOSite {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  type: "Cultural" | "Natural" | "Mixed";
  year: number;
  lat: number;
  lng: number;
}

export const unescoSites: UNESCOSite[] = [
  // Most famous and visited UNESCO sites
  { id: "great-wall", name: "Great Wall of China", country: "China", countryCode: "CN", type: "Cultural", year: 1987, lat: 40.4319, lng: 116.5704 },
  { id: "machu-picchu", name: "Machu Picchu", country: "Peru", countryCode: "PE", type: "Mixed", year: 1983, lat: -13.1631, lng: -72.5450 },
  { id: "petra", name: "Petra", country: "Jordan", countryCode: "JO", type: "Cultural", year: 1985, lat: 30.3285, lng: 35.4444 },
  { id: "taj-mahal", name: "Taj Mahal", country: "India", countryCode: "IN", type: "Cultural", year: 1983, lat: 27.1751, lng: 78.0421 },
  { id: "colosseum", name: "Colosseum", country: "Italy", countryCode: "IT", type: "Cultural", year: 1980, lat: 41.8902, lng: 12.4922 },
  { id: "chichen-itza", name: "Chichen Itza", country: "Mexico", countryCode: "MX", type: "Cultural", year: 1988, lat: 20.6843, lng: -88.5678 },
  { id: "christ-redeemer", name: "Christ the Redeemer", country: "Brazil", countryCode: "BR", type: "Cultural", year: 2012, lat: -22.9519, lng: -43.2105 },
  { id: "great-barrier-reef", name: "Great Barrier Reef", country: "Australia", countryCode: "AU", type: "Natural", year: 1981, lat: -18.2871, lng: 147.6992 },
  { id: "grand-canyon", name: "Grand Canyon", country: "United States", countryCode: "US", type: "Natural", year: 1979, lat: 36.1070, lng: -112.1130 },
  { id: "pyramids-giza", name: "Pyramids of Giza", country: "Egypt", countryCode: "EG", type: "Cultural", year: 1979, lat: 29.9792, lng: 31.1342 },
  { id: "angkor-wat", name: "Angkor", country: "Cambodia", countryCode: "KH", type: "Cultural", year: 1992, lat: 13.4125, lng: 103.8670 },
  { id: "acropolis", name: "Acropolis of Athens", country: "Greece", countryCode: "GR", type: "Cultural", year: 1987, lat: 37.9715, lng: 23.7267 },
  { id: "alhambra", name: "Alhambra", country: "Spain", countryCode: "ES", type: "Cultural", year: 1984, lat: 37.1760, lng: -3.5881 },
  { id: "stonehenge", name: "Stonehenge", country: "United Kingdom", countryCode: "GB", type: "Cultural", year: 1986, lat: 51.1789, lng: -1.8262 },
  { id: "versailles", name: "Palace of Versailles", country: "France", countryCode: "FR", type: "Cultural", year: 1979, lat: 48.8049, lng: 2.1204 },
  { id: "hagia-sophia", name: "Historic Areas of Istanbul", country: "Turkey", countryCode: "TR", type: "Cultural", year: 1985, lat: 41.0086, lng: 28.9802 },
  { id: "serengeti", name: "Serengeti National Park", country: "Tanzania", countryCode: "TZ", type: "Natural", year: 1981, lat: -2.3333, lng: 34.8333 },
  { id: "galapagos", name: "Galapagos Islands", country: "Ecuador", countryCode: "EC", type: "Natural", year: 1978, lat: -0.9538, lng: -90.9656 },
  { id: "yellowstone", name: "Yellowstone National Park", country: "United States", countryCode: "US", type: "Natural", year: 1978, lat: 44.4280, lng: -110.5885 },
  { id: "venice", name: "Venice and its Lagoon", country: "Italy", countryCode: "IT", type: "Cultural", year: 1987, lat: 45.4408, lng: 12.3155 },
  { id: "florence", name: "Historic Centre of Florence", country: "Italy", countryCode: "IT", type: "Cultural", year: 1982, lat: 43.7696, lng: 11.2558 },
  { id: "prague", name: "Historic Centre of Prague", country: "Czechia", countryCode: "CZ", type: "Cultural", year: 1992, lat: 50.0755, lng: 14.4378 },
  { id: "mont-st-michel", name: "Mont-Saint-Michel", country: "France", countryCode: "FR", type: "Cultural", year: 1979, lat: 48.6361, lng: -1.5115 },
  { id: "pompeii", name: "Pompeii", country: "Italy", countryCode: "IT", type: "Cultural", year: 1997, lat: 40.7509, lng: 14.4869 },
  { id: "easter-island", name: "Rapa Nui (Easter Island)", country: "Chile", countryCode: "CL", type: "Cultural", year: 1995, lat: -27.1127, lng: -109.3497 },
  { id: "ha-long-bay", name: "Ha Long Bay", country: "Vietnam", countryCode: "VN", type: "Natural", year: 1994, lat: 20.9101, lng: 107.1839 },
  { id: "uluru", name: "Uluru-Kata Tjuta", country: "Australia", countryCode: "AU", type: "Mixed", year: 1987, lat: -25.3444, lng: 131.0369 },
  { id: "sagrada-familia", name: "Works of Antoni Gaudi", country: "Spain", countryCode: "ES", type: "Cultural", year: 1984, lat: 41.4036, lng: 2.1744 },
  { id: "iguazu-falls", name: "Iguazu National Park", country: "Argentina", countryCode: "AR", type: "Natural", year: 1984, lat: -25.6953, lng: -54.4367 },
  { id: "victoria-falls", name: "Victoria Falls", country: "Zambia/Zimbabwe", countryCode: "ZM", type: "Natural", year: 1989, lat: -17.9243, lng: 25.8572 },
  { id: "neuschwanstein", name: "Castles of King Ludwig II", country: "Germany", countryCode: "DE", type: "Cultural", year: 2024, lat: 47.5576, lng: 10.7498 },
  { id: "statue-liberty", name: "Statue of Liberty", country: "United States", countryCode: "US", type: "Cultural", year: 1984, lat: 40.6892, lng: -74.0445 },
  { id: "forbidden-city", name: "Imperial Palaces (Forbidden City)", country: "China", countryCode: "CN", type: "Cultural", year: 1987, lat: 39.9163, lng: 116.3972 },
  { id: "terracotta-army", name: "Terracotta Army", country: "China", countryCode: "CN", type: "Cultural", year: 1987, lat: 34.3848, lng: 109.2734 },
  { id: "borobudur", name: "Borobudur Temple", country: "Indonesia", countryCode: "ID", type: "Cultural", year: 1991, lat: -7.6079, lng: 110.2038 },
  { id: "santorini", name: "Delos", country: "Greece", countryCode: "GR", type: "Cultural", year: 1990, lat: 37.3965, lng: 25.2686 },
  { id: "dubrovnik", name: "Old City of Dubrovnik", country: "Croatia", countryCode: "HR", type: "Cultural", year: 1979, lat: 42.6507, lng: 18.0944 },
  { id: "ancient-kyoto", name: "Historic Monuments of Ancient Kyoto", country: "Japan", countryCode: "JP", type: "Cultural", year: 1994, lat: 35.0116, lng: 135.7681 },
  { id: "hiroshima", name: "Hiroshima Peace Memorial", country: "Japan", countryCode: "JP", type: "Cultural", year: 1996, lat: 34.3955, lng: 132.4536 },
  { id: "mount-fuji", name: "Fujisan (Mount Fuji)", country: "Japan", countryCode: "JP", type: "Cultural", year: 2013, lat: 35.3606, lng: 138.7274 },
  { id: "amsterdam-canals", name: "Amsterdam Canal Ring", country: "Netherlands", countryCode: "NL", type: "Cultural", year: 2010, lat: 52.3676, lng: 4.9041 },
  { id: "bruges", name: "Historic Centre of Bruges", country: "Belgium", countryCode: "BE", type: "Cultural", year: 2000, lat: 51.2093, lng: 3.2247 },
  { id: "cinque-terre", name: "Cinque Terre", country: "Italy", countryCode: "IT", type: "Cultural", year: 1997, lat: 44.1461, lng: 9.6439 },
  { id: "banff", name: "Canadian Rocky Mountain Parks", country: "Canada", countryCode: "CA", type: "Natural", year: 1984, lat: 51.4968, lng: -115.9281 },
  { id: "old-havana", name: "Old Havana", country: "Cuba", countryCode: "CU", type: "Cultural", year: 1982, lat: 23.1365, lng: -82.3590 },
  { id: "edinburgh", name: "Old and New Towns of Edinburgh", country: "United Kingdom", countryCode: "GB", type: "Cultural", year: 1995, lat: 55.9533, lng: -3.1883 },
  { id: "tower-of-london", name: "Tower of London", country: "United Kingdom", countryCode: "GB", type: "Cultural", year: 1988, lat: 51.5081, lng: -0.0759 },
  { id: "westminster", name: "Westminster Abbey", country: "United Kingdom", countryCode: "GB", type: "Cultural", year: 1987, lat: 51.4993, lng: -0.1273 },
  { id: "louvre", name: "Banks of the Seine", country: "France", countryCode: "FR", type: "Cultural", year: 1991, lat: 48.8606, lng: 2.3376 },
  { id: "kremlin", name: "Moscow Kremlin and Red Square", country: "Russia", countryCode: "RU", type: "Cultural", year: 1990, lat: 55.7520, lng: 37.6175 },
];

export const siteTypes = ["Cultural", "Natural", "Mixed"];

export const getSitesByType = (type: string) =>
  unescoSites.filter(s => s.type === type);

export const getSitesByCountry = (countryCode: string) =>
  unescoSites.filter(s => s.countryCode === countryCode);

export const getTotalSites = () => unescoSites.length;
