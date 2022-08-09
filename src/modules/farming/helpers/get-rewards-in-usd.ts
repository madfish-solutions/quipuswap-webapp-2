import { toReal, multipliedIfPossible } from '@shared/helpers';
import { Nullable } from '@shared/types';

import { FarmingItemModel } from '../models';
import { UsersInfoValueWithId, getUserPendingReward } from './helpers';

export const getRewardsInUsd = (farmingItem: FarmingItemModel, userInfo: Nullable<UsersInfoValueWithId>) => {
  const rewards = userInfo && getUserPendingReward(userInfo, farmingItem);
  const realEarnBalance = rewards && toReal(rewards, farmingItem.rewardToken);

  return multipliedIfPossible(realEarnBalance, farmingItem.earnExchangeRate);
};
