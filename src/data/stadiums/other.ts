import type { Stadium } from './types';

// International Baseball
export const internationalBaseballStadiums: Stadium[] = [
  { id: "tokyo-dome", name: "Tokyo Dome", city: "Tokyo", country: "Japan", sport: "Baseball", capacity: 55000, lat: 35.7056, lng: 139.7519 },
  { id: "koshien", name: "Hanshin Koshien Stadium", city: "Nishinomiya", country: "Japan", sport: "Baseball", capacity: 47508, lat: 34.7211, lng: 135.3619 },
  { id: "jamsil", name: "Jamsil Baseball Stadium", city: "Seoul", country: "South Korea", sport: "Baseball", capacity: 25553, lat: 37.5122, lng: 127.0719 },
];

// Tennis Stadiums
export const tennisStadiums: Stadium[] = [
  // Grand Slam Venues
  { id: "arthur-ashe", name: "Arthur Ashe Stadium", city: "New York", country: "USA", sport: "Tennis", capacity: 23771, lat: 40.7498, lng: -73.8458, league: "US Open" },
  { id: "louis-armstrong", name: "Louis Armstrong Stadium", city: "New York", country: "USA", sport: "Tennis", capacity: 14053, lat: 40.7503, lng: -73.8467, league: "US Open" },
  { id: "centre-court", name: "Centre Court (Wimbledon)", city: "London", country: "UK", sport: "Tennis", capacity: 14979, lat: 51.4340, lng: -0.2135, league: "Wimbledon" },
  { id: "court-1-wimbledon", name: "No.1 Court (Wimbledon)", city: "London", country: "UK", sport: "Tennis", capacity: 12345, lat: 51.4335, lng: -0.2140, league: "Wimbledon" },
  { id: "rod-laver", name: "Rod Laver Arena", city: "Melbourne", country: "Australia", sport: "Tennis", capacity: 14820, lat: -37.8215, lng: 144.9784, league: "Australian Open" },
  { id: "margaret-court", name: "Margaret Court Arena", city: "Melbourne", country: "Australia", sport: "Tennis", capacity: 7500, lat: -37.8219, lng: 144.9792, league: "Australian Open" },
  { id: "john-cain", name: "John Cain Arena", city: "Melbourne", country: "Australia", sport: "Tennis", capacity: 10500, lat: -37.8208, lng: 144.9778, league: "Australian Open" },
  { id: "philippe-chatrier", name: "Court Philippe-Chatrier", city: "Paris", country: "France", sport: "Tennis", capacity: 15225, lat: 48.8469, lng: 2.2530, league: "French Open" },
  { id: "court-suzanne-lenglen", name: "Court Suzanne-Lenglen", city: "Paris", country: "France", sport: "Tennis", capacity: 10068, lat: 48.8461, lng: 2.2522, league: "French Open" },
  // ATP Masters 1000 / WTA 1000 Venues
  { id: "indian-wells", name: "Indian Wells Tennis Garden", city: "Indian Wells", country: "USA", sport: "Tennis", capacity: 16100, lat: 33.7239, lng: -116.3056, league: "ATP/WTA" },
  { id: "hard-rock-tennis", name: "Hard Rock Stadium (Tennis)", city: "Miami", country: "USA", sport: "Tennis", capacity: 14000, lat: 25.9580, lng: -80.2389, league: "ATP/WTA" },
  { id: "monte-carlo-tennis", name: "Monte-Carlo Country Club", city: "Monte Carlo", country: "Monaco", sport: "Tennis", capacity: 10200, lat: 43.7536, lng: 7.4406, league: "ATP" },
  { id: "caja-magica", name: "Caja Mágica", city: "Madrid", country: "Spain", sport: "Tennis", capacity: 12442, lat: 40.3722, lng: -3.6878, league: "ATP/WTA" },
  { id: "foro-italico", name: "Foro Italico", city: "Rome", country: "Italy", sport: "Tennis", capacity: 10500, lat: 41.9331, lng: 12.4550, league: "ATP/WTA" },
  { id: "iga-swiatek-arena", name: "IGA Stadium", city: "Montreal", country: "Canada", sport: "Tennis", capacity: 12126, lat: 45.5306, lng: -73.6250, league: "ATP/WTA" },
  { id: "sobeys-stadium", name: "Sobeys Stadium", city: "Toronto", country: "Canada", sport: "Tennis", capacity: 12500, lat: 43.7711, lng: -79.5111, league: "ATP/WTA" },
  { id: "lindner-family", name: "Lindner Family Tennis Center", city: "Cincinnati", country: "USA", sport: "Tennis", capacity: 11400, lat: 39.3472, lng: -84.3744, league: "ATP/WTA" },
  { id: "qizhong-forest", name: "Qizhong Forest Sports City Arena", city: "Shanghai", country: "China", sport: "Tennis", capacity: 15000, lat: 31.1431, lng: 121.3519, league: "ATP" },
  // ATP Finals / WTA Finals
  { id: "pala-alpitour", name: "Pala Alpitour", city: "Turin", country: "Italy", sport: "Tennis", capacity: 15000, lat: 45.0425, lng: 7.6619, league: "ATP Finals" },
  { id: "o2-arena-tennis", name: "The O2 Arena", city: "London", country: "UK", sport: "Tennis", capacity: 17500, lat: 51.5030, lng: 0.0032, league: "ATP Finals" },
  // Other Major Tennis Venues
  { id: "bercy", name: "Accor Arena (Paris-Bercy)", city: "Paris", country: "France", sport: "Tennis", capacity: 15609, lat: 48.8383, lng: 2.3781, league: "ATP" },
  { id: "dubai-tennis", name: "Dubai Tennis Stadium", city: "Dubai", country: "UAE", sport: "Tennis", capacity: 5000, lat: 25.2128, lng: 55.2519, league: "ATP/WTA" },
  { id: "qatar-tennis", name: "Khalifa International Tennis Complex", city: "Doha", country: "Qatar", sport: "Tennis", capacity: 7000, lat: 25.2597, lng: 51.4511, league: "ATP/WTA" },
  { id: "ariake-coliseum", name: "Ariake Coliseum", city: "Tokyo", country: "Japan", sport: "Tennis", capacity: 10000, lat: 35.6353, lng: 139.7903, league: "ATP/WTA" },
  { id: "abierto-mexicano", name: "Arena GNP Seguros", city: "Acapulco", country: "Mexico", sport: "Tennis", capacity: 6500, lat: 16.8589, lng: -99.8769, league: "ATP/WTA" },
  { id: "queen-s-club", name: "Queen's Club", city: "London", country: "UK", sport: "Tennis", capacity: 7500, lat: 51.4872, lng: -0.2144, league: "ATP" },
  { id: "halle-tennis", name: "OWL Arena", city: "Halle", country: "Germany", sport: "Tennis", capacity: 12300, lat: 52.0625, lng: 8.3508, league: "ATP" },
  { id: "us-open-grandstand", name: "Grandstand (US Open)", city: "New York", country: "USA", sport: "Tennis", capacity: 8125, lat: 40.7489, lng: -73.8442, league: "US Open" },
];

// Motorsport Circuits
export const motorsportStadiums: Stadium[] = [
  { id: "monaco", name: "Circuit de Monaco", city: "Monte Carlo", country: "Monaco", sport: "Motorsport", capacity: 37000, lat: 43.7347, lng: 7.4206 },
  { id: "silverstone", name: "Silverstone Circuit", city: "Silverstone", country: "UK", sport: "Motorsport", capacity: 150000, lat: 52.0786, lng: -1.0169 },
  { id: "monza", name: "Autodromo di Monza", city: "Monza", country: "Italy", sport: "Motorsport", capacity: 113000, lat: 45.6156, lng: 9.2811 },
  { id: "indy", name: "Indianapolis Motor Speedway", city: "Indianapolis", country: "USA", sport: "Motorsport", capacity: 257325, lat: 39.7950, lng: -86.2353 },
  { id: "daytona", name: "Daytona International Speedway", city: "Daytona Beach", country: "USA", sport: "Motorsport", capacity: 101500, lat: 29.1852, lng: -81.0705 },
  { id: "spa", name: "Circuit de Spa-Francorchamps", city: "Spa", country: "Belgium", sport: "Motorsport", capacity: 70000, lat: 50.4372, lng: 5.9714 },
  { id: "suzuka", name: "Suzuka International Racing Course", city: "Suzuka", country: "Japan", sport: "Motorsport", capacity: 155000, lat: 34.8431, lng: 136.5340 },
  { id: "interlagos", name: "Autódromo José Carlos Pace", city: "São Paulo", country: "Brazil", sport: "Motorsport", capacity: 60000, lat: -23.7036, lng: -46.6975 },
  { id: "yas-marina", name: "Yas Marina Circuit", city: "Abu Dhabi", country: "UAE", sport: "Motorsport", capacity: 60000, lat: 24.4672, lng: 54.6031 },
  { id: "cota", name: "Circuit of the Americas", city: "Austin", country: "USA", sport: "Motorsport", capacity: 120000, lat: 30.1327, lng: -97.6412 },
];
