import { multipliedIfPossible } from '@shared/helpers';
import { Nullable } from '@shared/types';

import { FarmingItemModel } from '../models';
import { getRewards } from './get-rewards';
import { UsersInfoValueWithId } from './helpers';

export const getRewardsInUsd = (farmingItem: FarmingItemModel, userInfo: Nullable<UsersInfoValueWithId>) => {
  const realEarnBalance = getRewards(farmingItem, userInfo);

  return multipliedIfPossible(realEarnBalance, farmingItem.earnExchangeRate);
};
