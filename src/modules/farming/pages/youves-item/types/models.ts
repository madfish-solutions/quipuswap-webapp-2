import BigNumber from 'bignumber.js';

import { FarmingItemV2YouvesModel } from '@modules/farming/models';
import { Nullable } from '@shared/types';

export interface YouvesFarmingItemWithBalances extends FarmingItemV2YouvesModel {
  depositBalance: Nullable<BigNumber>;
  earnBalance: Nullable<BigNumber>;
}
