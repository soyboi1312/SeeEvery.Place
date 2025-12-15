/**
 * Stadium Data Exports
 * Following SRP: This file is purely a barrel export
 * Logic and aggregation lives in stadiumUtils.ts
 */

// Re-export types
export type { Stadium } from './types';

// Re-export individual league/sport arrays
// (Kept for clients that only need specific data chunks)
export { mlbStadiums } from './mlb';
export { nflStadiums } from './nfl';
export { nbaStadiums } from './nba';
export { nhlStadiums } from './nhl';
export { mlsStadiums, internationalSoccerStadiums, soccerStadiums } from './soccer';
export { euroFootballStadiums, premierLeagueStadiums, laLigaStadiums, bundesligaStadiums, serieAStadiums, ligue1Stadiums } from './euroFootball';
export { rugbyStadiums, sixNationsStadiums, premiershipRugbyStadiums, top14Stadiums, urcStadiums, superRugbyStadiums } from './rugby';
export { cricketStadiums, australiaCricketStadiums, englandCricketStadiums, indiaCricketStadiums } from './cricket';
export {
  internationalBaseballStadiums,
  tennisStadiums,
  motorsportStadiums,
} from './other';

// Re-export getAllStadiums from utils (DRY - single source of truth)
import type { Stadium } from './types';
import { getAllStadiums } from './stadiumUtils';
export { getAllStadiums };

// Backwards compatibility alias (deprecated)
/** @deprecated Use getAllStadiums() instead for lazy/memoized evaluation */
export const stadiums: Stadium[] = getAllStadiums();

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
  getEuroFootballStadiums,
  getRugbyStadiums,
  getCricketStadiums,
} from './stadiumUtils';
