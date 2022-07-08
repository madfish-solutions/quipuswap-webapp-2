import { isNull } from '@shared/helpers';

import { GamersStats, GamersStatsRaw } from '../interfaces';

export const gamersStatsMapper = (gamersStats: Nullable<GamersStatsRaw>): GamersStats => {
  if (isNull(gamersStats)) {
    return {
      lastGameId: null,
      gamesCount: null,
      totalWonAmount: null,
      totalLostAmount: null,
      totalBetsAmount: null
    };
  }

  return {
    lastGameId: gamersStats.last_game_id,
    gamesCount: gamersStats.games_count,
    totalWonAmount: gamersStats.total_won_amt,
    totalLostAmount: gamersStats.total_lost_amt,
    totalBetsAmount: gamersStats.total_bets_amt
  };
};
