import type { Stadium } from './types';

// Australia - Cricket Venues
export const australiaCricketStadiums: Stadium[] = [
  { id: "cricket-mcg", name: "Melbourne Cricket Ground", city: "Melbourne", country: "Australia", sport: "Cricket", capacity: 100024, lat: -37.8200, lng: 144.9834, league: "Test Cricket" },
  { id: "cricket-scg", name: "Sydney Cricket Ground", city: "Sydney", country: "Australia", sport: "Cricket", capacity: 48000, lat: -33.8917, lng: 151.2247, league: "Test Cricket" },
  { id: "cricket-adelaide", name: "Adelaide Oval", city: "Adelaide", country: "Australia", sport: "Cricket", capacity: 53583, lat: -34.9156, lng: 138.5961, league: "Test Cricket" },
  { id: "cricket-gabba", name: "The Gabba", city: "Brisbane", country: "Australia", sport: "Cricket", capacity: 42000, lat: -27.4858, lng: 153.0381, league: "Test Cricket" },
  { id: "cricket-waca", name: "WACA Ground", city: "Perth", country: "Australia", sport: "Cricket", capacity: 24500, lat: -31.9603, lng: 115.8792, league: "Test Cricket" },
  { id: "cricket-optus", name: "Optus Stadium", city: "Perth", country: "Australia", sport: "Cricket", capacity: 60000, lat: -31.9512, lng: 115.8891, league: "Test Cricket" },
  { id: "cricket-bellerive", name: "Bellerive Oval", city: "Hobart", country: "Australia", sport: "Cricket", capacity: 20000, lat: -42.8756, lng: 147.3758, league: "Test Cricket" },
  { id: "cricket-manuka", name: "Manuka Oval", city: "Canberra", country: "Australia", sport: "Cricket", capacity: 13550, lat: -35.3183, lng: 149.1331, league: "Test Cricket" },
];

// England - Cricket Venues
export const englandCricketStadiums: Stadium[] = [
  { id: "cricket-lords", name: "Lord's Cricket Ground", city: "London", country: "UK", sport: "Cricket", capacity: 30000, lat: 51.5294, lng: -0.1729, league: "Test Cricket" },
  { id: "cricket-oval", name: "The Oval", city: "London", country: "UK", sport: "Cricket", capacity: 25500, lat: 51.4837, lng: -0.1152, league: "Test Cricket" },
  { id: "cricket-edgbaston", name: "Edgbaston Cricket Ground", city: "Birmingham", country: "UK", sport: "Cricket", capacity: 25000, lat: 52.4559, lng: -1.9025, league: "Test Cricket" },
  { id: "cricket-old-trafford", name: "Old Trafford Cricket Ground", city: "Manchester", country: "UK", sport: "Cricket", capacity: 26000, lat: 53.4569, lng: -2.2875, league: "Test Cricket" },
  { id: "cricket-headingley", name: "Headingley Cricket Ground", city: "Leeds", country: "UK", sport: "Cricket", capacity: 18350, lat: 53.8178, lng: -1.5822, league: "Test Cricket" },
  { id: "cricket-trent-bridge", name: "Trent Bridge", city: "Nottingham", country: "UK", sport: "Cricket", capacity: 17500, lat: 52.9369, lng: -1.1319, league: "Test Cricket" },
  { id: "cricket-rose-bowl", name: "The Rose Bowl", city: "Southampton", country: "UK", sport: "Cricket", capacity: 25000, lat: 50.9244, lng: -1.3222, league: "Test Cricket" },
  { id: "cricket-sophia", name: "Sophia Gardens", city: "Cardiff", country: "UK", sport: "Cricket", capacity: 15000, lat: 51.4822, lng: -3.1833, league: "Test Cricket" },
  { id: "cricket-riverside", name: "Seat Unique Riverside", city: "Chester-le-Street", country: "UK", sport: "Cricket", capacity: 17000, lat: 54.8156, lng: -1.5656, league: "Test Cricket" },
];

// India - Cricket Venues (IPL + International)
export const indiaCricketStadiums: Stadium[] = [
  { id: "cricket-eden-gardens", name: "Eden Gardens", city: "Kolkata", country: "India", sport: "Cricket", capacity: 68000, lat: 22.5647, lng: 88.3433, team: "Kolkata Knight Riders", league: "IPL" },
  { id: "cricket-wankhede", name: "Wankhede Stadium", city: "Mumbai", country: "India", sport: "Cricket", capacity: 33108, lat: 18.9389, lng: 72.8258, team: "Mumbai Indians", league: "IPL" },
  { id: "cricket-narendra-modi", name: "Narendra Modi Stadium", city: "Ahmedabad", country: "India", sport: "Cricket", capacity: 132000, lat: 23.0920, lng: 72.5967, team: "Gujarat Titans", league: "IPL" },
  { id: "cricket-chinnaswamy", name: "M. Chinnaswamy Stadium", city: "Bangalore", country: "India", sport: "Cricket", capacity: 40000, lat: 12.9788, lng: 77.5996, team: "Royal Challengers Bangalore", league: "IPL" },
  { id: "cricket-chidambaram", name: "MA Chidambaram Stadium", city: "Chennai", country: "India", sport: "Cricket", capacity: 50000, lat: 13.0627, lng: 80.2792, team: "Chennai Super Kings", league: "IPL" },
  { id: "cricket-arun-jaitley", name: "Arun Jaitley Stadium", city: "Delhi", country: "India", sport: "Cricket", capacity: 41820, lat: 28.6377, lng: 77.2433, team: "Delhi Capitals", league: "IPL" },
  { id: "cricket-rajiv-gandhi", name: "Rajiv Gandhi International Stadium", city: "Hyderabad", country: "India", sport: "Cricket", capacity: 55000, lat: 17.4065, lng: 78.5507, team: "Sunrisers Hyderabad", league: "IPL" },
  { id: "cricket-punjab", name: "Punjab Cricket Association Stadium", city: "Mohali", country: "India", sport: "Cricket", capacity: 26950, lat: 30.6928, lng: 76.7377, team: "Punjab Kings", league: "IPL" },
  { id: "cricket-sawai", name: "Sawai Mansingh Stadium", city: "Jaipur", country: "India", sport: "Cricket", capacity: 30000, lat: 26.8956, lng: 75.8028, team: "Rajasthan Royals", league: "IPL" },
  { id: "cricket-ekana", name: "Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium", city: "Lucknow", country: "India", sport: "Cricket", capacity: 50000, lat: 26.8583, lng: 81.0156, team: "Lucknow Super Giants", league: "IPL" },
  { id: "cricket-dharamsala", name: "Himachal Pradesh Cricket Association Stadium", city: "Dharamsala", country: "India", sport: "Cricket", capacity: 23000, lat: 32.2214, lng: 76.3269, league: "Test Cricket" },
  { id: "cricket-greenfield", name: "Greenfield International Stadium", city: "Thiruvananthapuram", country: "India", sport: "Cricket", capacity: 55000, lat: 8.5603, lng: 76.8839, league: "International" },
  { id: "cricket-vidarbha", name: "Vidarbha Cricket Association Stadium", city: "Nagpur", country: "India", sport: "Cricket", capacity: 45000, lat: 21.0903, lng: 79.0558, league: "International" },
  { id: "cricket-holkar", name: "Holkar Cricket Stadium", city: "Indore", country: "India", sport: "Cricket", capacity: 30000, lat: 22.7139, lng: 75.8408, league: "International" },
];

// Pakistan - Cricket Venues
export const pakistanCricketStadiums: Stadium[] = [
  { id: "cricket-national-karachi", name: "National Stadium", city: "Karachi", country: "Pakistan", sport: "Cricket", capacity: 34228, lat: 24.8925, lng: 67.0675, team: "Karachi Kings", league: "PSL" },
  { id: "cricket-gaddafi", name: "Gaddafi Stadium", city: "Lahore", country: "Pakistan", sport: "Cricket", capacity: 27000, lat: 31.5136, lng: 74.3358, team: "Lahore Qalandars", league: "PSL" },
  { id: "cricket-rawalpindi", name: "Rawalpindi Cricket Stadium", city: "Rawalpindi", country: "Pakistan", sport: "Cricket", capacity: 15000, lat: 33.6167, lng: 73.0833, team: "Islamabad United", league: "PSL" },
  { id: "cricket-multan", name: "Multan Cricket Stadium", city: "Multan", country: "Pakistan", sport: "Cricket", capacity: 35000, lat: 30.1928, lng: 71.4575, team: "Multan Sultans", league: "PSL" },
  { id: "cricket-peshawar", name: "Arbab Niaz Stadium", city: "Peshawar", country: "Pakistan", sport: "Cricket", capacity: 50000, lat: 33.9892, lng: 71.5500, team: "Peshawar Zalmi", league: "PSL" },
  { id: "cricket-faisalabad", name: "Iqbal Stadium", city: "Faisalabad", country: "Pakistan", sport: "Cricket", capacity: 20000, lat: 31.4167, lng: 73.0833, league: "International" },
];

// South Africa - Cricket Venues
export const southAfricaCricketStadiums: Stadium[] = [
  { id: "cricket-newlands", name: "Newlands Cricket Ground", city: "Cape Town", country: "South Africa", sport: "Cricket", capacity: 25000, lat: -33.9281, lng: 18.4394, league: "Test Cricket" },
  { id: "cricket-wanderers", name: "The Wanderers Stadium", city: "Johannesburg", country: "South Africa", sport: "Cricket", capacity: 34000, lat: -26.1328, lng: 28.0561, league: "Test Cricket" },
  { id: "cricket-supersport", name: "SuperSport Park", city: "Centurion", country: "South Africa", sport: "Cricket", capacity: 22000, lat: -25.8103, lng: 28.2128, league: "Test Cricket" },
  { id: "cricket-kingsmead", name: "Kingsmead Cricket Ground", city: "Durban", country: "South Africa", sport: "Cricket", capacity: 25000, lat: -29.8528, lng: 31.0192, league: "Test Cricket" },
  { id: "cricket-st-georges", name: "St George's Park", city: "Port Elizabeth", country: "South Africa", sport: "Cricket", capacity: 19000, lat: -33.9614, lng: 25.6025, league: "Test Cricket" },
  { id: "cricket-boland", name: "Boland Park", city: "Paarl", country: "South Africa", sport: "Cricket", capacity: 10000, lat: -33.7500, lng: 18.9667, league: "International" },
];

// New Zealand - Cricket Venues
export const newZealandCricketStadiums: Stadium[] = [
  { id: "cricket-basin-reserve", name: "Basin Reserve", city: "Wellington", country: "New Zealand", sport: "Cricket", capacity: 11600, lat: -41.2969, lng: 174.7781, league: "Test Cricket" },
  { id: "cricket-hagley", name: "Hagley Oval", city: "Christchurch", country: "New Zealand", sport: "Cricket", capacity: 20000, lat: -43.5256, lng: 172.6197, league: "Test Cricket" },
  { id: "cricket-eden-park-nz", name: "Eden Park", city: "Auckland", country: "New Zealand", sport: "Cricket", capacity: 50000, lat: -36.8746, lng: 174.7448, league: "Test Cricket" },
  { id: "cricket-bay-oval", name: "Bay Oval", city: "Mount Maunganui", country: "New Zealand", sport: "Cricket", capacity: 6000, lat: -37.6500, lng: 176.2000, league: "International" },
  { id: "cricket-seddon", name: "Seddon Park", city: "Hamilton", country: "New Zealand", sport: "Cricket", capacity: 10000, lat: -37.7861, lng: 175.2819, league: "International" },
  { id: "cricket-university-oval", name: "University Oval", city: "Dunedin", country: "New Zealand", sport: "Cricket", capacity: 5000, lat: -45.8625, lng: 170.5150, league: "International" },
];

// West Indies - Cricket Venues
export const westIndiesCricketStadiums: Stadium[] = [
  { id: "cricket-kensington", name: "Kensington Oval", city: "Bridgetown", country: "Barbados", sport: "Cricket", capacity: 28000, lat: 13.1075, lng: -59.6231, league: "Test Cricket" },
  { id: "cricket-sabina", name: "Sabina Park", city: "Kingston", country: "Jamaica", sport: "Cricket", capacity: 20000, lat: 17.9886, lng: -76.7828, league: "Test Cricket" },
  { id: "cricket-queens-park", name: "Queen's Park Oval", city: "Port of Spain", country: "Trinidad and Tobago", sport: "Cricket", capacity: 25000, lat: 10.6714, lng: -61.5086, league: "Test Cricket" },
  { id: "cricket-providence", name: "Providence Stadium", city: "Providence", country: "Guyana", sport: "Cricket", capacity: 20000, lat: 6.8128, lng: -58.1647, league: "Test Cricket" },
  { id: "cricket-vivian-richards", name: "Sir Vivian Richards Stadium", city: "St. John's", country: "Antigua", sport: "Cricket", capacity: 10000, lat: 17.1478, lng: -61.8031, league: "Test Cricket" },
  { id: "cricket-daren-sammy", name: "Daren Sammy National Cricket Stadium", city: "Gros Islet", country: "Saint Lucia", sport: "Cricket", capacity: 15000, lat: 14.0842, lng: -60.9536, league: "Test Cricket" },
  { id: "cricket-windsor-park", name: "Windsor Park", city: "Roseau", country: "Dominica", sport: "Cricket", capacity: 8000, lat: 15.3031, lng: -61.3883, league: "Test Cricket" },
  { id: "cricket-brian-lara", name: "Brian Lara Cricket Academy", city: "Tarouba", country: "Trinidad and Tobago", sport: "Cricket", capacity: 15000, lat: 10.2939, lng: -61.4272, league: "Test Cricket" },
];

// Sri Lanka - Cricket Venues
export const sriLankaCricketStadiums: Stadium[] = [
  { id: "cricket-premadasa", name: "R. Premadasa Stadium", city: "Colombo", country: "Sri Lanka", sport: "Cricket", capacity: 35000, lat: 6.9147, lng: 79.8628, league: "Test Cricket" },
  { id: "cricket-galle", name: "Galle International Stadium", city: "Galle", country: "Sri Lanka", sport: "Cricket", capacity: 35000, lat: 6.0328, lng: 80.2150, league: "Test Cricket" },
  { id: "cricket-pallekele", name: "Pallekele International Stadium", city: "Kandy", country: "Sri Lanka", sport: "Cricket", capacity: 35000, lat: 7.2164, lng: 80.6828, league: "Test Cricket" },
  { id: "cricket-sinhalese", name: "Sinhalese Sports Club Ground", city: "Colombo", country: "Sri Lanka", sport: "Cricket", capacity: 15000, lat: 6.9167, lng: 79.8656, league: "Test Cricket" },
  { id: "cricket-dambulla", name: "Rangiri Dambulla International Stadium", city: "Dambulla", country: "Sri Lanka", sport: "Cricket", capacity: 20000, lat: 7.8600, lng: 80.6419, league: "International" },
];

// Bangladesh - Cricket Venues
export const bangladeshCricketStadiums: Stadium[] = [
  { id: "cricket-sher-e-bangla", name: "Sher-e-Bangla National Cricket Stadium", city: "Dhaka", country: "Bangladesh", sport: "Cricket", capacity: 26000, lat: 23.8067, lng: 90.3678, league: "Test Cricket" },
  { id: "cricket-zahur-ahmed", name: "Zahur Ahmed Chowdhury Stadium", city: "Chattogram", country: "Bangladesh", sport: "Cricket", capacity: 22000, lat: 22.3528, lng: 91.8239, league: "Test Cricket" },
  { id: "cricket-sylhet", name: "Sylhet International Cricket Stadium", city: "Sylhet", country: "Bangladesh", sport: "Cricket", capacity: 18500, lat: 24.8944, lng: 91.8822, league: "Test Cricket" },
];

// Zimbabwe - Cricket Venues
export const zimbabweCricketStadiums: Stadium[] = [
  { id: "cricket-harare", name: "Harare Sports Club", city: "Harare", country: "Zimbabwe", sport: "Cricket", capacity: 10000, lat: -17.8111, lng: 31.0456, league: "Test Cricket" },
  { id: "cricket-queens-club-zim", name: "Queens Sports Club", city: "Bulawayo", country: "Zimbabwe", sport: "Cricket", capacity: 9000, lat: -20.1653, lng: 28.5906, league: "Test Cricket" },
];

// UAE - Cricket Venues
export const uaeCricketStadiums: Stadium[] = [
  { id: "cricket-dubai", name: "Dubai International Cricket Stadium", city: "Dubai", country: "UAE", sport: "Cricket", capacity: 25000, lat: 25.0478, lng: 55.2078, league: "International" },
  { id: "cricket-sheikh-zayed", name: "Sheikh Zayed Cricket Stadium", city: "Abu Dhabi", country: "UAE", sport: "Cricket", capacity: 20000, lat: 24.4672, lng: 54.3833, league: "International" },
  { id: "cricket-sharjah", name: "Sharjah Cricket Stadium", city: "Sharjah", country: "UAE", sport: "Cricket", capacity: 27000, lat: 25.3367, lng: 55.4208, league: "International" },
];

// Ireland - Cricket Venues
export const irelandCricketStadiums: Stadium[] = [
  { id: "cricket-malahide", name: "Malahide Cricket Club Ground", city: "Dublin", country: "Ireland", sport: "Cricket", capacity: 11500, lat: 53.4500, lng: -6.1500, league: "Test Cricket" },
  { id: "cricket-stormont", name: "Stormont", city: "Belfast", country: "UK", sport: "Cricket", capacity: 10000, lat: 54.6014, lng: -5.8139, league: "International" },
];

// Afghanistan - Cricket Venues
export const afghanistanCricketStadiums: Stadium[] = [
  { id: "cricket-greater-noida", name: "Shahid Vijay Singh Pathik Sports Complex", city: "Greater Noida", country: "India", sport: "Cricket", capacity: 25000, lat: 28.4817, lng: 77.5036, team: "Afghanistan (home ground)", league: "International" },
  { id: "cricket-kabul", name: "Ghazi Amanullah Khan International Cricket Stadium", city: "Kabul", country: "Afghanistan", sport: "Cricket", capacity: 6000, lat: 34.5167, lng: 69.1500, league: "International" },
  { id: "cricket-lucknow-afg", name: "Ekana Cricket Stadium", city: "Lucknow", country: "India", sport: "Cricket", capacity: 50000, lat: 26.8583, lng: 81.0156, team: "Afghanistan (home ground)", league: "International" },
];

// Combined Cricket Stadiums (all venues)
export const cricketStadiums: Stadium[] = [
  ...australiaCricketStadiums,
  ...englandCricketStadiums,
  ...indiaCricketStadiums,
  ...pakistanCricketStadiums,
  ...southAfricaCricketStadiums,
  ...newZealandCricketStadiums,
  ...westIndiesCricketStadiums,
  ...sriLankaCricketStadiums,
  ...bangladeshCricketStadiums,
  ...zimbabweCricketStadiums,
  ...uaeCricketStadiums,
  ...irelandCricketStadiums,
  ...afghanistanCricketStadiums,
];
