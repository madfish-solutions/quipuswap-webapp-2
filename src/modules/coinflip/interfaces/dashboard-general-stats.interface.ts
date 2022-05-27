import { BigNumber } from 'bignumber.js';

export interface DashboardGeneralStats {
  bank: Nullable<BigNumber>;
  gamesCount: Nullable<BigNumber>;
  payoutCoefficient: Nullable<BigNumber>;
  totalWins: Nullable<BigNumber>;
}

export interface DashboardGeneralStatsMapped {
  bank: Nullable<string>;
  gamesCount: Nullable<string>;
  payoutCoefficient: Nullable<string>;
  totalWins: Nullable<string>;
}
