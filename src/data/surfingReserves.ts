export interface SurfingReserve {
  id: string;
  name: string;
  location: string;
  country: string;
  region: string;
  lat: number;
  lng: number;
  designation?: number; // year designated as World Surfing Reserve
  waveType?: string;
}

// World Surfing Reserves and legendary surf spots
export const surfingReserves: SurfingReserve[] = [
  // Official World Surfing Reserves
  { id: "malibu", name: "Malibu", location: "California", country: "USA", region: "North America", lat: 34.0259, lng: -118.6798, designation: 2010, waveType: "Right point break" },
  { id: "manly", name: "Manly Beach", location: "Sydney, NSW", country: "Australia", region: "Oceania", lat: -33.7970, lng: 151.2877, designation: 2012, waveType: "Beach break" },
  { id: "santa-cruz", name: "Santa Cruz", location: "California", country: "USA", region: "North America", lat: 36.9519, lng: -122.0264, designation: 2012, waveType: "Various" },
  { id: "ericeira", name: "Ericeira", location: "Lisbon District", country: "Portugal", region: "Europe", lat: 38.9631, lng: -9.4170, designation: 2011, waveType: "Various" },
  { id: "huanchaco", name: "Huanchaco", location: "La Libertad", country: "Peru", region: "South America", lat: -8.0801, lng: -79.1197, designation: 2013, waveType: "Left point break" },
  { id: "gold-coast", name: "Gold Coast", location: "Queensland", country: "Australia", region: "Oceania", lat: -28.0023, lng: 153.4310, designation: 2016, waveType: "Various point breaks" },
  { id: "bahia-todos-santos", name: "Bahía de Todos Santos", location: "Baja California", country: "Mexico", region: "North America", lat: 31.8350, lng: -116.6250, designation: 2014, waveType: "Big wave" },
  { id: "punta-de-lobos", name: "Punta de Lobos", location: "Pichilemu", country: "Chile", region: "South America", lat: -34.4317, lng: -72.0392, designation: 2013, waveType: "Left point break" },
  { id: "guarda-do-embau", name: "Guarda do Embaú", location: "Santa Catarina", country: "Brazil", region: "South America", lat: -27.9013, lng: -48.5969, designation: 2016, waveType: "Various" },
  { id: "noosa", name: "Noosa", location: "Queensland", country: "Australia", region: "Oceania", lat: -26.3908, lng: 153.0950, designation: 2018, waveType: "Right point break" },
  { id: "taghazout", name: "Taghazout", location: "Souss-Massa", country: "Morocco", region: "Africa", lat: 30.5425, lng: -9.7138, designation: 2024, waveType: "Various" },

  // Legendary Surf Spots (not officially designated but iconic)
  { id: "pipeline", name: "Pipeline", location: "Oahu, Hawaii", country: "USA", region: "North America", lat: 21.6637, lng: -158.0533, waveType: "Left reef break" },
  { id: "teahupoo", name: "Teahupo'o", location: "Tahiti", country: "French Polynesia", region: "Oceania", lat: -17.8580, lng: -149.2544, waveType: "Left reef break" },
  { id: "jeffreys-bay", name: "Jeffreys Bay", location: "Eastern Cape", country: "South Africa", region: "Africa", lat: -34.0353, lng: 24.9262, waveType: "Right point break" },
  { id: "hossegor", name: "Hossegor", location: "Landes", country: "France", region: "Europe", lat: 43.6623, lng: -1.4376, waveType: "Beach break tubes" },
  { id: "uluwatu", name: "Uluwatu", location: "Bali", country: "Indonesia", region: "Asia", lat: -8.8291, lng: 115.0849, waveType: "Left reef break" },
  { id: "cloudbreak", name: "Cloudbreak", location: "Tavarua Island", country: "Fiji", region: "Oceania", lat: -17.8692, lng: 177.1897, waveType: "Left reef break" },
  { id: "bells-beach", name: "Bells Beach", location: "Victoria", country: "Australia", region: "Oceania", lat: -38.3690, lng: 144.2765, waveType: "Right point break" },
  { id: "nazare", name: "Nazaré", location: "Leiria", country: "Portugal", region: "Europe", lat: 39.5997, lng: -9.0714, waveType: "Big wave" },
  { id: "mundaka", name: "Mundaka", location: "Basque Country", country: "Spain", region: "Europe", lat: 43.4072, lng: -2.6992, waveType: "Left river mouth" },
  { id: "g-land", name: "G-Land (Grajagan)", location: "East Java", country: "Indonesia", region: "Asia", lat: -8.7333, lng: 114.3833, waveType: "Left reef break" },
  { id: "peniche", name: "Supertubos", location: "Peniche", country: "Portugal", region: "Europe", lat: 39.3517, lng: -9.3642, waveType: "Beach break tubes" },
  { id: "trestles", name: "Trestles", location: "California", country: "USA", region: "North America", lat: 33.3831, lng: -117.5893, waveType: "Various cobblestone" },
  { id: "snapper-rocks", name: "Snapper Rocks", location: "Gold Coast, Queensland", country: "Australia", region: "Oceania", lat: -28.1625, lng: 153.5506, waveType: "Right point break" },
  { id: "margaret-river", name: "Margaret River", location: "Western Australia", country: "Australia", region: "Oceania", lat: -33.9714, lng: 114.9966, waveType: "Various powerful" },
  { id: "mentawai", name: "Mentawai Islands", location: "West Sumatra", country: "Indonesia", region: "Asia", lat: -2.0878, lng: 99.4753, waveType: "Various perfect" },
];

export const surfingReserveRegions = ["North America", "South America", "Europe", "Africa", "Asia", "Oceania"];

export const getSurfingReservesByRegion = (region: string) =>
  surfingReserves.filter(s => s.region === region);

export const getTotalSurfingReserves = () => surfingReserves.length;
