import { BigNumber } from 'bignumber.js';

export interface DashboardGeneralStats {
  bank: Nullable<BigNumber>;
  gamesCount: Nullable<BigNumber>;
  payoutCoefficient: Nullable<BigNumber>;
  totalWins: Nullable<BigNumber>;
}
