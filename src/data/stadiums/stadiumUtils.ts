/**
 * Stadium Utility Functions
 * Separated from index.ts for Single Responsibility Principle
 */
import type { Stadium } from './types';

// Import all stadium data for utility functions
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

// Combined stadiums array (lazy-initialized to avoid circular deps)
let _allStadiums: Stadium[] | null = null;

function getAllStadiums(): Stadium[] {
  if (!_allStadiums) {
    _allStadiums = [
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
  }
  return _allStadiums;
}

// Filter functions
export const getStadiumsBySport = (sport: string): Stadium[] =>
  getAllStadiums().filter(s => s.sport === sport);

export const getStadiumsByLeague = (league: string): Stadium[] =>
  getAllStadiums().filter(s => s.league === league);

export const getStadiumsByCountry = (country: string): Stadium[] =>
  getAllStadiums().filter(s => s.country === country);

export const getTotalStadiums = (): number => getAllStadiums().length;

// Category-specific getters (used by mapRegistry)
export const getMlbStadiums = (): Stadium[] => [...mlbStadiums, ...internationalBaseballStadiums];
export const getNflStadiums = (): Stadium[] => nflStadiums;
export const getNbaStadiums = (): Stadium[] => nbaStadiums;
export const getNhlStadiums = (): Stadium[] => nhlStadiums;
export const getSoccerStadiums = (): Stadium[] => soccerStadiums;
