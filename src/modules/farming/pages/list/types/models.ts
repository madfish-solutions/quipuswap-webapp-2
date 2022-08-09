import { BigNumber } from 'bignumber.js';

import { FarmingItemBalancesModel, FarmingItemModel } from '../../../models';

export type FarmingItemWithBalances = FarmingItemModel & {
  depositBalance: Nullable<BigNumber>;
  earnBalance: Nullable<BigNumber>;
};

export type FarmingListItemWithBalances = FarmingItemModel & FarmingItemBalancesModel;
