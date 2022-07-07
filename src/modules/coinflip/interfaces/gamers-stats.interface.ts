import BigNumber from 'bignumber.js';

import { Nullable } from '@shared/types';

export interface GamersStatsRaw {
  last_game_id: BigNumber;
  games_count: BigNumber;
  total_won_amt: BigNumber;
  total_lost_amt: BigNumber;
  total_bets_amt: BigNumber;
}

export interface GamersStats {
  lastGameId: Nullable<BigNumber>;
  gamesCount: Nullable<BigNumber>;
  totalWonAmount: Nullable<BigNumber>;
  totalLostAmount: Nullable<BigNumber>;
  totalBetsAmount: Nullable<BigNumber>;
}
