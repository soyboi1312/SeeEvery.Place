import type { Stadium } from './types';

// NFL - National Football League (32 teams)
export const nflStadiums: Stadium[] = [
  // AFC East
  { id: "nfl-bills", name: "Highmark Stadium", city: "Orchard Park", country: "USA", sport: "American Football", capacity: 71608, lat: 42.7738, lng: -78.7870, team: "Buffalo Bills", league: "NFL" },
  { id: "nfl-dolphins", name: "Hard Rock Stadium", city: "Miami Gardens", country: "USA", sport: "American Football", capacity: 65326, lat: 25.9580, lng: -80.2389, team: "Miami Dolphins", league: "NFL" },
  { id: "nfl-patriots", name: "Gillette Stadium", city: "Foxborough", country: "USA", sport: "American Football", capacity: 65878, lat: 42.0909, lng: -71.2643, team: "New England Patriots", league: "NFL" },
  { id: "nfl-jets", name: "MetLife Stadium", city: "East Rutherford", country: "USA", sport: "American Football", capacity: 82500, lat: 40.8128, lng: -74.0742, team: "New York Jets", league: "NFL" },
  // AFC North
  { id: "nfl-ravens", name: "M&T Bank Stadium", city: "Baltimore", country: "USA", sport: "American Football", capacity: 71008, lat: 39.2780, lng: -76.6227, team: "Baltimore Ravens", league: "NFL" },
  { id: "nfl-bengals", name: "Paycor Stadium", city: "Cincinnati", country: "USA", sport: "American Football", capacity: 65515, lat: 39.0955, lng: -84.5161, team: "Cincinnati Bengals", league: "NFL" },
  { id: "nfl-browns", name: "Cleveland Browns Stadium", city: "Cleveland", country: "USA", sport: "American Football", capacity: 67431, lat: 41.5061, lng: -81.6995, team: "Cleveland Browns", league: "NFL" },
  { id: "nfl-steelers", name: "Acrisure Stadium", city: "Pittsburgh", country: "USA", sport: "American Football", capacity: 68400, lat: 40.4468, lng: -80.0158, team: "Pittsburgh Steelers", league: "NFL" },
  // AFC South
  { id: "nfl-texans", name: "NRG Stadium", city: "Houston", country: "USA", sport: "American Football", capacity: 72220, lat: 29.6847, lng: -95.4107, team: "Houston Texans", league: "NFL" },
  { id: "nfl-colts", name: "Lucas Oil Stadium", city: "Indianapolis", country: "USA", sport: "American Football", capacity: 67000, lat: 39.7601, lng: -86.1639, team: "Indianapolis Colts", league: "NFL" },
  { id: "nfl-jaguars", name: "EverBank Stadium", city: "Jacksonville", country: "USA", sport: "American Football", capacity: 67814, lat: 30.3239, lng: -81.6373, team: "Jacksonville Jaguars", league: "NFL" },
  { id: "nfl-titans", name: "Nissan Stadium", city: "Nashville", country: "USA", sport: "American Football", capacity: 69143, lat: 36.1665, lng: -86.7713, team: "Tennessee Titans", league: "NFL" },
  // AFC West
  { id: "nfl-broncos", name: "Empower Field at Mile High", city: "Denver", country: "USA", sport: "American Football", capacity: 76125, lat: 39.7439, lng: -105.0201, team: "Denver Broncos", league: "NFL" },
  { id: "nfl-chiefs", name: "Arrowhead Stadium", city: "Kansas City", country: "USA", sport: "American Football", capacity: 76416, lat: 39.0489, lng: -94.4839, team: "Kansas City Chiefs", league: "NFL" },
  { id: "nfl-raiders", name: "Allegiant Stadium", city: "Las Vegas", country: "USA", sport: "American Football", capacity: 65000, lat: 36.0909, lng: -115.1833, team: "Las Vegas Raiders", league: "NFL" },
  { id: "nfl-chargers", name: "SoFi Stadium", city: "Inglewood", country: "USA", sport: "American Football", capacity: 70240, lat: 33.9534, lng: -118.3392, team: "Los Angeles Chargers", league: "NFL" },
  // NFC East
  { id: "nfl-cowboys", name: "AT&T Stadium", city: "Arlington", country: "USA", sport: "American Football", capacity: 80000, lat: 32.7473, lng: -97.0945, team: "Dallas Cowboys", league: "NFL" },
  { id: "nfl-giants", name: "MetLife Stadium (Giants)", city: "East Rutherford", country: "USA", sport: "American Football", capacity: 82500, lat: 40.8135, lng: -74.0745, team: "New York Giants", league: "NFL" },
  { id: "nfl-eagles", name: "Lincoln Financial Field", city: "Philadelphia", country: "USA", sport: "American Football", capacity: 69796, lat: 39.9008, lng: -75.1675, team: "Philadelphia Eagles", league: "NFL" },
  { id: "nfl-commanders", name: "Commanders Field", city: "Landover", country: "USA", sport: "American Football", capacity: 67617, lat: 38.9076, lng: -76.8645, team: "Washington Commanders", league: "NFL" },
  // NFC North
  { id: "nfl-bears", name: "Soldier Field", city: "Chicago", country: "USA", sport: "American Football", capacity: 61500, lat: 41.8623, lng: -87.6167, team: "Chicago Bears", league: "NFL" },
  { id: "nfl-lions", name: "Ford Field", city: "Detroit", country: "USA", sport: "American Football", capacity: 65000, lat: 42.3400, lng: -83.0456, team: "Detroit Lions", league: "NFL" },
  { id: "nfl-packers", name: "Lambeau Field", city: "Green Bay", country: "USA", sport: "American Football", capacity: 81441, lat: 44.5013, lng: -88.0622, team: "Green Bay Packers", league: "NFL" },
  { id: "nfl-vikings", name: "U.S. Bank Stadium", city: "Minneapolis", country: "USA", sport: "American Football", capacity: 66860, lat: 44.9737, lng: -93.2575, team: "Minnesota Vikings", league: "NFL" },
  // NFC South
  { id: "nfl-falcons", name: "Mercedes-Benz Stadium", city: "Atlanta", country: "USA", sport: "American Football", capacity: 71000, lat: 33.7553, lng: -84.4006, team: "Atlanta Falcons", league: "NFL" },
  { id: "nfl-panthers", name: "Bank of America Stadium", city: "Charlotte", country: "USA", sport: "American Football", capacity: 74867, lat: 35.2258, lng: -80.8528, team: "Carolina Panthers", league: "NFL" },
  { id: "nfl-saints", name: "Caesars Superdome", city: "New Orleans", country: "USA", sport: "American Football", capacity: 73208, lat: 29.9511, lng: -90.0812, team: "New Orleans Saints", league: "NFL" },
  { id: "nfl-bucs", name: "Raymond James Stadium", city: "Tampa", country: "USA", sport: "American Football", capacity: 69218, lat: 27.9759, lng: -82.5033, team: "Tampa Bay Buccaneers", league: "NFL" },
  // NFC West
  { id: "nfl-cardinals", name: "State Farm Stadium", city: "Glendale", country: "USA", sport: "American Football", capacity: 63400, lat: 33.5276, lng: -112.2626, team: "Arizona Cardinals", league: "NFL" },
  { id: "nfl-rams", name: "SoFi Stadium (Rams)", city: "Inglewood", country: "USA", sport: "American Football", capacity: 70240, lat: 33.9536, lng: -118.3390, team: "Los Angeles Rams", league: "NFL" },
  { id: "nfl-49ers", name: "Levi's Stadium", city: "Santa Clara", country: "USA", sport: "American Football", capacity: 68500, lat: 37.4033, lng: -121.9694, team: "San Francisco 49ers", league: "NFL" },
  { id: "nfl-seahawks", name: "Lumen Field", city: "Seattle", country: "USA", sport: "American Football", capacity: 68740, lat: 47.5952, lng: -122.3316, team: "Seattle Seahawks", league: "NFL" },
];
