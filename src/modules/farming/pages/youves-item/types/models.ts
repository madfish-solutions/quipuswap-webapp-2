import BigNumber from 'bignumber.js';

import { YouvesFarmingItemModel } from '@modules/farming/models';
import { Nullable } from '@shared/types';

export interface YouvesFarmingItemWithBalances extends YouvesFarmingItemModel {
  depositBalance: Nullable<BigNumber>;
  earnBalance: Nullable<BigNumber>;
}
