export interface Marathon {
  id: string;
  name: string;
  city: string;
  country: string;
  month: string;
  lat: number;
  lng: number;
}

// World Marathon Majors (Abbott World Marathon Majors)
export const marathons: Marathon[] = [
  { id: "tokyo", name: "Tokyo Marathon", city: "Tokyo", country: "Japan", month: "March", lat: 35.6762, lng: 139.6503 },
  { id: "boston", name: "Boston Marathon", city: "Boston", country: "USA", month: "April", lat: 42.3601, lng: -71.0589 },
  { id: "london", name: "London Marathon", city: "London", country: "UK", month: "April", lat: 51.5074, lng: -0.1278 },
  { id: "berlin", name: "Berlin Marathon", city: "Berlin", country: "Germany", month: "September", lat: 52.5200, lng: 13.4050 },
  { id: "chicago", name: "Chicago Marathon", city: "Chicago", country: "USA", month: "October", lat: 41.8781, lng: -87.6298 },
  { id: "new-york", name: "New York City Marathon", city: "New York", country: "USA", month: "November", lat: 40.7128, lng: -74.0060 },
  { id: "sydney", name: "Sydney Marathon", city: "Sydney", country: "Australia", month: "September", lat: -33.8688, lng: 151.2093 },
];

export const getTotalMarathons = () => marathons.length;

export const getMarathonsByCountry = (country: string) =>
  marathons.filter(m => m.country === country);
