export interface F1Track {
  id: string;
  name: string;
  circuit: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  active: boolean; // Currently on F1 calendar
}

// Formula 1 Race Tracks - Current calendar and notable historic circuits
export const f1Tracks: F1Track[] = [
  // Current F1 Calendar (2024-2025)
  { id: "bahrain", name: "Bahrain Grand Prix", circuit: "Bahrain International Circuit", city: "Sakhir", country: "Bahrain", lat: 26.0325, lng: 50.5106, active: true },
  { id: "saudi-arabia", name: "Saudi Arabian Grand Prix", circuit: "Jeddah Corniche Circuit", city: "Jeddah", country: "Saudi Arabia", lat: 21.6319, lng: 39.1044, active: true },
  { id: "australia", name: "Australian Grand Prix", circuit: "Albert Park Circuit", city: "Melbourne", country: "Australia", lat: -37.8497, lng: 144.9680, active: true },
  { id: "japan", name: "Japanese Grand Prix", circuit: "Suzuka International Racing Course", city: "Suzuka", country: "Japan", lat: 34.8431, lng: 136.5340, active: true },
  { id: "china", name: "Chinese Grand Prix", circuit: "Shanghai International Circuit", city: "Shanghai", country: "China", lat: 31.3389, lng: 121.2197, active: true },
  { id: "miami", name: "Miami Grand Prix", circuit: "Miami International Autodrome", city: "Miami", country: "USA", lat: 25.9581, lng: -80.2389, active: true },
  { id: "emilia-romagna", name: "Emilia Romagna Grand Prix", circuit: "Autodromo Enzo e Dino Ferrari", city: "Imola", country: "Italy", lat: 44.3439, lng: 11.7167, active: true },
  { id: "monaco", name: "Monaco Grand Prix", circuit: "Circuit de Monaco", city: "Monte Carlo", country: "Monaco", lat: 43.7347, lng: 7.4206, active: true },
  { id: "canada", name: "Canadian Grand Prix", circuit: "Circuit Gilles Villeneuve", city: "Montreal", country: "Canada", lat: 45.5000, lng: -73.5228, active: true },
  { id: "spain", name: "Spanish Grand Prix", circuit: "Circuit de Barcelona-Catalunya", city: "Barcelona", country: "Spain", lat: 41.5700, lng: 2.2611, active: true },
  { id: "austria", name: "Austrian Grand Prix", circuit: "Red Bull Ring", city: "Spielberg", country: "Austria", lat: 47.2197, lng: 14.7647, active: true },
  { id: "great-britain", name: "British Grand Prix", circuit: "Silverstone Circuit", city: "Silverstone", country: "UK", lat: 52.0786, lng: -1.0169, active: true },
  { id: "hungary", name: "Hungarian Grand Prix", circuit: "Hungaroring", city: "Budapest", country: "Hungary", lat: 47.5789, lng: 19.2486, active: true },
  { id: "belgium", name: "Belgian Grand Prix", circuit: "Circuit de Spa-Francorchamps", city: "Spa", country: "Belgium", lat: 50.4372, lng: 5.9714, active: true },
  { id: "netherlands", name: "Dutch Grand Prix", circuit: "Circuit Zandvoort", city: "Zandvoort", country: "Netherlands", lat: 52.3888, lng: 4.5409, active: true },
  { id: "italy", name: "Italian Grand Prix", circuit: "Autodromo Nazionale Monza", city: "Monza", country: "Italy", lat: 45.6156, lng: 9.2811, active: true },
  { id: "azerbaijan", name: "Azerbaijan Grand Prix", circuit: "Baku City Circuit", city: "Baku", country: "Azerbaijan", lat: 40.3725, lng: 49.8533, active: true },
  { id: "singapore", name: "Singapore Grand Prix", circuit: "Marina Bay Street Circuit", city: "Singapore", country: "Singapore", lat: 1.2914, lng: 103.8644, active: true },
  { id: "usa", name: "United States Grand Prix", circuit: "Circuit of the Americas", city: "Austin", country: "USA", lat: 30.1328, lng: -97.6411, active: true },
  { id: "mexico", name: "Mexican Grand Prix", circuit: "Autodromo Hermanos Rodriguez", city: "Mexico City", country: "Mexico", lat: 19.4042, lng: -99.0907, active: true },
  { id: "brazil", name: "Brazilian Grand Prix", circuit: "Autodromo Jose Carlos Pace", city: "Sao Paulo", country: "Brazil", lat: -23.7014, lng: -46.6969, active: true },
  { id: "las-vegas", name: "Las Vegas Grand Prix", circuit: "Las Vegas Strip Circuit", city: "Las Vegas", country: "USA", lat: 36.1147, lng: -115.1728, active: true },
  { id: "qatar", name: "Qatar Grand Prix", circuit: "Lusail International Circuit", city: "Lusail", country: "Qatar", lat: 25.4900, lng: 51.4542, active: true },
  { id: "abu-dhabi", name: "Abu Dhabi Grand Prix", circuit: "Yas Marina Circuit", city: "Abu Dhabi", country: "UAE", lat: 24.4672, lng: 54.6031, active: true },

  // Historic/Notable Circuits (not currently on calendar)
  { id: "germany-nurburgring", name: "German Grand Prix (Nurburgring)", circuit: "Nurburgring", city: "Nurburg", country: "Germany", lat: 50.3356, lng: 6.9475, active: false },
  { id: "germany-hockenheim", name: "German Grand Prix (Hockenheim)", circuit: "Hockenheimring", city: "Hockenheim", country: "Germany", lat: 49.3278, lng: 8.5656, active: false },
  { id: "france", name: "French Grand Prix", circuit: "Circuit Paul Ricard", city: "Le Castellet", country: "France", lat: 43.2506, lng: 5.7917, active: false },
  { id: "portugal", name: "Portuguese Grand Prix", circuit: "Autodromo Internacional do Algarve", city: "Portimao", country: "Portugal", lat: 37.2272, lng: -8.6267, active: false },
  { id: "turkey", name: "Turkish Grand Prix", circuit: "Istanbul Park", city: "Istanbul", country: "Turkey", lat: 40.9517, lng: 29.4050, active: false },
  { id: "korea", name: "Korean Grand Prix", circuit: "Korea International Circuit", city: "Yeongam", country: "South Korea", lat: 34.7333, lng: 126.4167, active: false },
  { id: "india", name: "Indian Grand Prix", circuit: "Buddh International Circuit", city: "Greater Noida", country: "India", lat: 28.3487, lng: 77.5331, active: false },
  { id: "malaysia", name: "Malaysian Grand Prix", circuit: "Sepang International Circuit", city: "Sepang", country: "Malaysia", lat: 2.7614, lng: 101.7372, active: false },
  { id: "russia", name: "Russian Grand Prix", circuit: "Sochi Autodrom", city: "Sochi", country: "Russia", lat: 43.4057, lng: 39.9578, active: false },
  { id: "south-africa", name: "South African Grand Prix", circuit: "Kyalami Grand Prix Circuit", city: "Johannesburg", country: "South Africa", lat: -25.9903, lng: 28.0728, active: false },
];

export const getActiveF1Tracks = () => f1Tracks.filter(t => t.active);
export const getHistoricF1Tracks = () => f1Tracks.filter(t => !t.active);
export const getTotalF1Tracks = () => f1Tracks.length;
export const getF1TracksByCountry = (country: string) => f1Tracks.filter(t => t.country === country);
