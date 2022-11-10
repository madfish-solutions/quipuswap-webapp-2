import { multipliedIfPossible } from '@shared/helpers';
import { Nullable } from '@shared/types';

import { FarmingListItemModel } from '../models';
import { getRewards } from './get-rewards';
import { IFarmingListUsersInfoValueWithId } from './helpers';

export const getRewardsInUsd = (
  farmingItem: FarmingListItemModel,
  userInfo: Nullable<IFarmingListUsersInfoValueWithId>
) => {
  const realEarnBalance = getRewards(farmingItem, userInfo);

  return multipliedIfPossible(realEarnBalance, farmingItem.earnExchangeRate);
};
