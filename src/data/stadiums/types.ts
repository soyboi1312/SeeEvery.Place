export interface Stadium {
  id: string;
  name: string;
  city: string;
  country: string;
  sport: string;
  capacity: number;
  lat: number;
  lng: number;
  team?: string;
  league?: string;
}
