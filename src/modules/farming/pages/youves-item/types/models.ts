import BigNumber from 'bignumber.js';

import { FarmingItemV2YouvesModel } from '@modules/farming/models';

export interface YouvesFarmingItemWithBalances extends FarmingItemV2YouvesModel {
  depositBalance: Nullable<BigNumber>;
  earnBalance: Nullable<BigNumber>;
}
