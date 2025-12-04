export interface Museum {
  id: string;
  name: string;
  city: string;
  country: string;
  type: string;
  lat: number;
  lng: number;
}

// Famous museums from around the world
export const museums: Museum[] = [
  // France
  { id: "louvre", name: "Louvre Museum", city: "Paris", country: "France", type: "Art", lat: 48.8606, lng: 2.3376 },
  { id: "orsay", name: "Musée d'Orsay", city: "Paris", country: "France", type: "Art", lat: 48.8600, lng: 2.3266 },
  { id: "pompidou", name: "Centre Pompidou", city: "Paris", country: "France", type: "Modern Art", lat: 48.8607, lng: 2.3524 },
  { id: "rodin", name: "Musée Rodin", city: "Paris", country: "France", type: "Art", lat: 48.8554, lng: 2.3158 },

  // USA
  { id: "met", name: "The Metropolitan Museum of Art", city: "New York", country: "USA", type: "Art", lat: 40.7794, lng: -73.9632 },
  { id: "moma", name: "Museum of Modern Art (MoMA)", city: "New York", country: "USA", type: "Modern Art", lat: 40.7614, lng: -73.9776 },
  { id: "guggenheim-nyc", name: "Solomon R. Guggenheim Museum", city: "New York", country: "USA", type: "Modern Art", lat: 40.7830, lng: -73.9590 },
  { id: "smithsonian", name: "Smithsonian National Museum", city: "Washington D.C.", country: "USA", type: "Natural History", lat: 38.8913, lng: -77.0261 },
  { id: "air-space", name: "National Air and Space Museum", city: "Washington D.C.", country: "USA", type: "Science", lat: 38.8882, lng: -77.0199 },
  { id: "getty", name: "The Getty Center", city: "Los Angeles", country: "USA", type: "Art", lat: 34.0780, lng: -118.4741 },
  { id: "art-institute-chicago", name: "Art Institute of Chicago", city: "Chicago", country: "USA", type: "Art", lat: 41.8796, lng: -87.6237 },
  { id: "mfa-boston", name: "Museum of Fine Arts", city: "Boston", country: "USA", type: "Art", lat: 42.3394, lng: -71.0940 },

  // UK
  { id: "british-museum", name: "British Museum", city: "London", country: "UK", type: "History", lat: 51.5194, lng: -0.1270 },
  { id: "national-gallery", name: "National Gallery", city: "London", country: "UK", type: "Art", lat: 51.5089, lng: -0.1283 },
  { id: "tate-modern", name: "Tate Modern", city: "London", country: "UK", type: "Modern Art", lat: 51.5076, lng: -0.0994 },
  { id: "va-museum", name: "Victoria and Albert Museum", city: "London", country: "UK", type: "Art & Design", lat: 51.4966, lng: -0.1722 },
  { id: "natural-history-london", name: "Natural History Museum", city: "London", country: "UK", type: "Natural History", lat: 51.4967, lng: -0.1764 },

  // Netherlands
  { id: "rijksmuseum", name: "Rijksmuseum", city: "Amsterdam", country: "Netherlands", type: "Art", lat: 52.3600, lng: 4.8852 },
  { id: "van-gogh", name: "Van Gogh Museum", city: "Amsterdam", country: "Netherlands", type: "Art", lat: 52.3584, lng: 4.8811 },
  { id: "anne-frank", name: "Anne Frank House", city: "Amsterdam", country: "Netherlands", type: "History", lat: 52.3752, lng: 4.8840 },

  // Spain
  { id: "prado", name: "Museo del Prado", city: "Madrid", country: "Spain", type: "Art", lat: 40.4138, lng: -3.6921 },
  { id: "reina-sofia", name: "Museo Reina Sofía", city: "Madrid", country: "Spain", type: "Modern Art", lat: 40.4086, lng: -3.6944 },
  { id: "guggenheim-bilbao", name: "Guggenheim Museum Bilbao", city: "Bilbao", country: "Spain", type: "Modern Art", lat: 43.2687, lng: -2.9340 },

  // Italy
  { id: "uffizi", name: "Uffizi Gallery", city: "Florence", country: "Italy", type: "Art", lat: 43.7687, lng: 11.2558 },
  { id: "vatican-museums", name: "Vatican Museums", city: "Vatican City", country: "Italy", type: "Art", lat: 41.9065, lng: 12.4536 },
  { id: "accademia", name: "Galleria dell'Accademia", city: "Florence", country: "Italy", type: "Art", lat: 43.7769, lng: 11.2587 },
  { id: "borghese", name: "Galleria Borghese", city: "Rome", country: "Italy", type: "Art", lat: 41.9142, lng: 12.4922 },

  // Germany
  { id: "pergamon", name: "Pergamon Museum", city: "Berlin", country: "Germany", type: "History", lat: 52.5212, lng: 13.3969 },
  { id: "neues-museum", name: "Neues Museum", city: "Berlin", country: "Germany", type: "History", lat: 52.5206, lng: 13.3979 },
  { id: "alte-pinakothek", name: "Alte Pinakothek", city: "Munich", country: "Germany", type: "Art", lat: 48.1482, lng: 11.5700 },

  // Austria
  { id: "kunsthistorisches", name: "Kunsthistorisches Museum", city: "Vienna", country: "Austria", type: "Art", lat: 48.2039, lng: 16.3616 },
  { id: "belvedere", name: "Belvedere Museum", city: "Vienna", country: "Austria", type: "Art", lat: 48.1914, lng: 16.3808 },

  // Russia
  { id: "hermitage", name: "State Hermitage Museum", city: "St. Petersburg", country: "Russia", type: "Art", lat: 59.9398, lng: 30.3146 },
  { id: "tretyakov", name: "Tretyakov Gallery", city: "Moscow", country: "Russia", type: "Art", lat: 55.7415, lng: 37.6208 },

  // Asia
  { id: "national-palace-taipei", name: "National Palace Museum", city: "Taipei", country: "Taiwan", type: "Art", lat: 25.1024, lng: 121.5485 },
  { id: "tokyo-national", name: "Tokyo National Museum", city: "Tokyo", country: "Japan", type: "Art", lat: 35.7189, lng: 139.7765 },
  { id: "national-museum-korea", name: "National Museum of Korea", city: "Seoul", country: "South Korea", type: "History", lat: 37.5209, lng: 126.9803 },
  { id: "shanghai-museum", name: "Shanghai Museum", city: "Shanghai", country: "China", type: "Art", lat: 31.2290, lng: 121.4731 },
  { id: "forbidden-city", name: "Palace Museum (Forbidden City)", city: "Beijing", country: "China", type: "History", lat: 39.9163, lng: 116.3972 },

  // Middle East
  { id: "egyptian-museum", name: "Egyptian Museum", city: "Cairo", country: "Egypt", type: "History", lat: 30.0478, lng: 31.2336 },
  { id: "louvre-abu-dhabi", name: "Louvre Abu Dhabi", city: "Abu Dhabi", country: "UAE", type: "Art", lat: 24.5336, lng: 54.3984 },
  { id: "israel-museum", name: "Israel Museum", city: "Jerusalem", country: "Israel", type: "Art & History", lat: 31.7741, lng: 35.2042 },

  // Australia
  { id: "nga-canberra", name: "National Gallery of Australia", city: "Canberra", country: "Australia", type: "Art", lat: -35.3000, lng: 149.1353 },
  { id: "nsw-gallery", name: "Art Gallery of New South Wales", city: "Sydney", country: "Australia", type: "Art", lat: -33.8688, lng: 151.2173 },

  // Latin America
  { id: "museo-nacional-antropologia", name: "Museo Nacional de Antropología", city: "Mexico City", country: "Mexico", type: "History", lat: 19.4260, lng: -99.1863 },
  { id: "masp", name: "MASP", city: "São Paulo", country: "Brazil", type: "Art", lat: -23.5614, lng: -46.6558 },
];

export const getMuseumsByCountry = (country: string) =>
  museums.filter(m => m.country === country);

export const getMuseumsByType = (type: string) =>
  museums.filter(m => m.type === type);

export const getTotalMuseums = () => museums.length;
