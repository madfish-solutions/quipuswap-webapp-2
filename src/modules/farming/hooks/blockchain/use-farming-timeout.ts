import { MS_IN_SECOND } from '@config/constants';
import { isUndefined } from '@shared/helpers';
import { Undefined } from '@shared/types';

import { useFarmingItemStore } from '../stores';

const TIME_LOCK_ENDS = 0;

const getTimeout = (lastStaked: Undefined<Date>, timelock: Undefined<string>) => {
  if (isUndefined(lastStaked) || isUndefined(timelock)) {
    return null;
  }

  const lastStakedTime = lastStaked.getTime();
  const endTimestamp = lastStakedTime + Number(timelock) * MS_IN_SECOND;

  return Math.max(endTimestamp - Date.now(), TIME_LOCK_ENDS);
};

export const useFarmingTimeout = () => {
  const { farmingItem, userInfoStore } = useFarmingItemStore();
  const timelock = farmingItem?.timelock;
  const lastStaked = userInfoStore.data?.last_staked;

  const timeout = getTimeout(lastStaked, timelock);

  return { timeout, isUnlocked: timeout === TIME_LOCK_ENDS };
};
