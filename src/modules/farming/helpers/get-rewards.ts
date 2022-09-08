import { toReal } from '@shared/helpers';
import { Nullable } from '@shared/types';

import { FarmingItemModel } from '../models';
import { getUserPendingReward, UsersInfoValueWithId } from './helpers';

export const getRewards = (farmingItem: FarmingItemModel, userInfo: Nullable<UsersInfoValueWithId>) => {
  const rewards = userInfo && getUserPendingReward(userInfo, farmingItem);

  return rewards && toReal(rewards, farmingItem.rewardToken);
};
