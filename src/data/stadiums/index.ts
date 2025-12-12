/**
 * Stadium Data Exports
 * Following SRP: This file only handles data exports
 * Utility functions are in stadiumUtils.ts
 */

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

// Re-export utility functions from stadiumUtils.ts (SRP)
export {
  getStadiumsBySport,
  getStadiumsByLeague,
  getStadiumsByCountry,
  getTotalStadiums,
  getMlbStadiums,
  getNflStadiums,
  getNbaStadiums,
  getNhlStadiums,
  getSoccerStadiums,
} from './stadiumUtils';
