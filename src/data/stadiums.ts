// Re-export everything from the stadiums directory for backwards compatibility
export type { Stadium } from './stadiums/types';
export {
  stadiums,
  sports,
  leagues,
  getStadiumsBySport,
  getStadiumsByLeague,
  getStadiumsByCountry,
  getTotalStadiums,
  getMlbStadiums,
  getNflStadiums,
  getNbaStadiums,
  getNhlStadiums,
  getSoccerStadiums,
} from './stadiums/index';
