import { BigNumber } from 'bignumber.js';

import { Nullable } from '@shared/types';

export interface DashboardGeneralStats {
  bank: Nullable<BigNumber>;
  gamesCount: Nullable<BigNumber>;
  payoutCoefficient: Nullable<BigNumber>;
  totalWins: Nullable<BigNumber>;
  maxBetPercent: Nullable<BigNumber>;
}

export interface DashboardGeneralStatsMapped {
  bank: Nullable<string>;
  gamesCount: Nullable<string>;
  payoutCoefficient: Nullable<string>;
  totalWins: Nullable<string>;
  maxBetPercent: Nullable<string>;
}
