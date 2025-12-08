import type { Stadium } from './types';

// International Baseball
export const internationalBaseballStadiums: Stadium[] = [
  { id: "tokyo-dome", name: "Tokyo Dome", city: "Tokyo", country: "Japan", sport: "Baseball", capacity: 55000, lat: 35.7056, lng: 139.7519 },
  { id: "koshien", name: "Hanshin Koshien Stadium", city: "Nishinomiya", country: "Japan", sport: "Baseball", capacity: 47508, lat: 34.7211, lng: 135.3619 },
  { id: "jamsil", name: "Jamsil Baseball Stadium", city: "Seoul", country: "South Korea", sport: "Baseball", capacity: 25553, lat: 37.5122, lng: 127.0719 },
];

// Cricket Stadiums
export const cricketStadiums: Stadium[] = [
  // Australia
  { id: "mcg", name: "Melbourne Cricket Ground", city: "Melbourne", country: "Australia", sport: "Cricket", capacity: 100024, lat: -37.8200, lng: 144.9834 },
  { id: "scg", name: "Sydney Cricket Ground", city: "Sydney", country: "Australia", sport: "Cricket", capacity: 48000, lat: -33.8917, lng: 151.2247 },
  { id: "adelaide-oval", name: "Adelaide Oval", city: "Adelaide", country: "Australia", sport: "Cricket", capacity: 53583, lat: -34.9156, lng: 138.5961 },
  { id: "gabba", name: "The Gabba", city: "Brisbane", country: "Australia", sport: "Cricket", capacity: 42000, lat: -27.4858, lng: 153.0381 },
  { id: "waca", name: "WACA Ground", city: "Perth", country: "Australia", sport: "Cricket", capacity: 24500, lat: -31.9603, lng: 115.8792 },
  { id: "optus-stadium", name: "Optus Stadium", city: "Perth", country: "Australia", sport: "Cricket", capacity: 60000, lat: -31.9512, lng: 115.8891 },
  // England
  { id: "lords", name: "Lord's Cricket Ground", city: "London", country: "UK", sport: "Cricket", capacity: 30000, lat: 51.5294, lng: -0.1729 },
  { id: "the-oval", name: "The Oval", city: "London", country: "UK", sport: "Cricket", capacity: 25500, lat: 51.4837, lng: -0.1152 },
  { id: "edgbaston", name: "Edgbaston Cricket Ground", city: "Birmingham", country: "UK", sport: "Cricket", capacity: 25000, lat: 52.4559, lng: -1.9025 },
  { id: "old-trafford-cricket", name: "Old Trafford Cricket Ground", city: "Manchester", country: "UK", sport: "Cricket", capacity: 26000, lat: 53.4569, lng: -2.2875 },
  { id: "headingley", name: "Headingley Cricket Ground", city: "Leeds", country: "UK", sport: "Cricket", capacity: 18350, lat: 53.8178, lng: -1.5822 },
  { id: "trent-bridge", name: "Trent Bridge", city: "Nottingham", country: "UK", sport: "Cricket", capacity: 17500, lat: 52.9369, lng: -1.1319 },
  { id: "rose-bowl", name: "The Rose Bowl", city: "Southampton", country: "UK", sport: "Cricket", capacity: 25000, lat: 50.9244, lng: -1.3222 },
  // India
  { id: "eden-gardens", name: "Eden Gardens", city: "Kolkata", country: "India", sport: "Cricket", capacity: 68000, lat: 22.5647, lng: 88.3433 },
  { id: "wankhede", name: "Wankhede Stadium", city: "Mumbai", country: "India", sport: "Cricket", capacity: 33108, lat: 18.9389, lng: 72.8258 },
  { id: "narendra-modi", name: "Narendra Modi Stadium", city: "Ahmedabad", country: "India", sport: "Cricket", capacity: 132000, lat: 23.0920, lng: 72.5967 },
  { id: "chinnaswamy", name: "M. Chinnaswamy Stadium", city: "Bangalore", country: "India", sport: "Cricket", capacity: 40000, lat: 12.9788, lng: 77.5996 },
  { id: "chidambaram", name: "MA Chidambaram Stadium", city: "Chennai", country: "India", sport: "Cricket", capacity: 50000, lat: 13.0627, lng: 80.2792 },
  { id: "feroz-shah-kotla", name: "Arun Jaitley Stadium", city: "Delhi", country: "India", sport: "Cricket", capacity: 41820, lat: 28.6377, lng: 77.2433 },
  { id: "rajiv-gandhi", name: "Rajiv Gandhi International Stadium", city: "Hyderabad", country: "India", sport: "Cricket", capacity: 55000, lat: 17.4065, lng: 78.5507 },
  { id: "punjab-cricket", name: "Punjab Cricket Association Stadium", city: "Mohali", country: "India", sport: "Cricket", capacity: 26950, lat: 30.6928, lng: 76.7377 },
  // Pakistan
  { id: "national-karachi", name: "National Stadium", city: "Karachi", country: "Pakistan", sport: "Cricket", capacity: 34228, lat: 24.8925, lng: 67.0675 },
  { id: "gaddafi-stadium", name: "Gaddafi Stadium", city: "Lahore", country: "Pakistan", sport: "Cricket", capacity: 27000, lat: 31.5136, lng: 74.3358 },
  { id: "rawalpindi-cricket", name: "Rawalpindi Cricket Stadium", city: "Rawalpindi", country: "Pakistan", sport: "Cricket", capacity: 15000, lat: 33.6167, lng: 73.0833 },
  // South Africa
  { id: "newlands", name: "Newlands Cricket Ground", city: "Cape Town", country: "South Africa", sport: "Cricket", capacity: 25000, lat: -33.9281, lng: 18.4394 },
  { id: "wanderers", name: "The Wanderers Stadium", city: "Johannesburg", country: "South Africa", sport: "Cricket", capacity: 34000, lat: -26.1328, lng: 28.0561 },
  { id: "supersport-park", name: "SuperSport Park", city: "Centurion", country: "South Africa", sport: "Cricket", capacity: 22000, lat: -25.8103, lng: 28.2128 },
  { id: "kingsmead", name: "Kingsmead Cricket Ground", city: "Durban", country: "South Africa", sport: "Cricket", capacity: 25000, lat: -29.8528, lng: 31.0192 },
  // New Zealand
  { id: "basin-reserve", name: "Basin Reserve", city: "Wellington", country: "New Zealand", sport: "Cricket", capacity: 11600, lat: -41.2969, lng: 174.7781 },
  { id: "hagley-oval", name: "Hagley Oval", city: "Christchurch", country: "New Zealand", sport: "Cricket", capacity: 20000, lat: -43.5256, lng: 172.6197 },
  { id: "eden-park-cricket", name: "Eden Park (Cricket)", city: "Auckland", country: "New Zealand", sport: "Cricket", capacity: 50000, lat: -36.8746, lng: 174.7448 },
  // West Indies
  { id: "kensington-oval", name: "Kensington Oval", city: "Bridgetown", country: "Barbados", sport: "Cricket", capacity: 28000, lat: 13.1075, lng: -59.6231 },
  { id: "sabina-park", name: "Sabina Park", city: "Kingston", country: "Jamaica", sport: "Cricket", capacity: 20000, lat: 17.9886, lng: -76.7828 },
  { id: "queens-park-oval", name: "Queen's Park Oval", city: "Port of Spain", country: "Trinidad", sport: "Cricket", capacity: 25000, lat: 10.6714, lng: -61.5086 },
  // Sri Lanka
  { id: "r-premadasa", name: "R. Premadasa Stadium", city: "Colombo", country: "Sri Lanka", sport: "Cricket", capacity: 35000, lat: 6.9147, lng: 79.8628 },
  { id: "galle-international", name: "Galle International Stadium", city: "Galle", country: "Sri Lanka", sport: "Cricket", capacity: 35000, lat: 6.0328, lng: 80.2150 },
  { id: "pallekele", name: "Pallekele International Stadium", city: "Kandy", country: "Sri Lanka", sport: "Cricket", capacity: 35000, lat: 7.2164, lng: 80.6828 },
  // Bangladesh
  { id: "sher-e-bangla", name: "Sher-e-Bangla Stadium", city: "Dhaka", country: "Bangladesh", sport: "Cricket", capacity: 26000, lat: 23.8067, lng: 90.3678 },
  // Zimbabwe
  { id: "harare-sports-club", name: "Harare Sports Club", city: "Harare", country: "Zimbabwe", sport: "Cricket", capacity: 10000, lat: -17.8111, lng: 31.0456 },
  // UAE
  { id: "dubai-cricket", name: "Dubai International Cricket Stadium", city: "Dubai", country: "UAE", sport: "Cricket", capacity: 25000, lat: 25.0478, lng: 55.2078 },
  { id: "sheikh-zayed", name: "Sheikh Zayed Cricket Stadium", city: "Abu Dhabi", country: "UAE", sport: "Cricket", capacity: 20000, lat: 24.4672, lng: 54.3833 },
];

// Rugby Stadiums
export const rugbyStadiums: Stadium[] = [
  { id: "twickenham", name: "Twickenham Stadium", city: "London", country: "UK", sport: "Rugby", capacity: 82000, lat: 51.4559, lng: -0.3415 },
  { id: "stade-de-france", name: "Stade de France", city: "Paris", country: "France", sport: "Rugby", capacity: 81338, lat: 48.9244, lng: 2.3601 },
  { id: "eden-park", name: "Eden Park", city: "Auckland", country: "New Zealand", sport: "Rugby", capacity: 50000, lat: -36.8746, lng: 174.7448 },
  { id: "principality", name: "Principality Stadium", city: "Cardiff", country: "UK", sport: "Rugby", capacity: 73931, lat: 51.4782, lng: -3.1826 },
  { id: "aviva-stadium", name: "Aviva Stadium", city: "Dublin", country: "Ireland", sport: "Rugby", capacity: 51700, lat: 53.3353, lng: -6.2289 },
  { id: "ellis-park", name: "Ellis Park Stadium", city: "Johannesburg", country: "South Africa", sport: "Rugby", capacity: 62567, lat: -26.1987, lng: 28.0561 },
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
