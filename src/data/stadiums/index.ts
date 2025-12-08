// Re-export types
export type { Stadium } from './types';

// Re-export individual league/sport arrays
export { mlbStadiums } from './mlb';
export { nflStadiums } from './nfl';
export { nbaStadiums } from './nba';
export { nhlStadiums } from './nhl';
export { mlsStadiums, internationalSoccerStadiums, soccerStadiums } from './soccer';
export {
  internationalBaseballStadiums,
  cricketStadiums,
  rugbyStadiums,
  tennisStadiums,
  motorsportStadiums,
} from './other';

// Import for combined array
import { mlbStadiums } from './mlb';
import { nflStadiums } from './nfl';
import { nbaStadiums } from './nba';
import { nhlStadiums } from './nhl';
import { soccerStadiums } from './soccer';
import {
  internationalBaseballStadiums,
  cricketStadiums,
  rugbyStadiums,
  tennisStadiums,
  motorsportStadiums,
} from './other';
import type { Stadium } from './types';

// Combined stadiums array (for backwards compatibility)
export const stadiums: Stadium[] = [
  ...mlbStadiums,
  ...nflStadiums,
  ...nbaStadiums,
  ...nhlStadiums,
  ...soccerStadiums,
  ...internationalBaseballStadiums,
  ...cricketStadiums,
  ...rugbyStadiums,
  ...tennisStadiums,
  ...motorsportStadiums,
];

// Sport and league constants
export const sports = ["Baseball", "American Football", "Basketball", "Hockey", "Football", "Cricket", "Rugby", "Tennis", "Motorsport"];
export const leagues = ["MLB", "NFL", "NBA", "NHL", "MLS"];

// Utility functions
export const getStadiumsBySport = (sport: string) =>
  stadiums.filter(s => s.sport === sport);

export const getStadiumsByLeague = (league: string) =>
  stadiums.filter(s => s.league === league);

export const getStadiumsByCountry = (country: string) =>
  stadiums.filter(s => s.country === country);

export const getTotalStadiums = () => stadiums.length;

// Category-specific getters (for backwards compatibility)
export const getMlbStadiums = () => [...mlbStadiums, ...internationalBaseballStadiums];
export const getNflStadiums = () => nflStadiums;
export const getNbaStadiums = () => nbaStadiums;
export const getNhlStadiums = () => nhlStadiums;
export const getSoccerStadiums = () => soccerStadiums;
