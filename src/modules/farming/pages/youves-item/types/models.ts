import BigNumber from 'bignumber.js';

import { YouvesFarmingItemModel } from '@modules/farming/models';

export interface YouvesFarmingItemWithBalances extends YouvesFarmingItemModel {
  depositBalance: Nullable<BigNumber>;
  earnBalance: Nullable<BigNumber>;
}
