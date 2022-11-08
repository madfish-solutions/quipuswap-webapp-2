import { toReal } from '@shared/helpers';
import { Nullable } from '@shared/types';

import { FarmingListItemModel } from '../models';
import { getUserPendingReward, IFarmingListUsersInfoValueWithId } from './helpers';

export const getRewards = (farmingItem: FarmingListItemModel, userInfo: Nullable<IFarmingListUsersInfoValueWithId>) => {
  const rewards = userInfo && getUserPendingReward(userInfo, farmingItem);

  return rewards && toReal(rewards, farmingItem.rewardToken);
};
