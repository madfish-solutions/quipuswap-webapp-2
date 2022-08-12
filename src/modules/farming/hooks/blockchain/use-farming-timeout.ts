import { MS_IN_SECOND } from '@config/constants';
import { getMinEndTime } from '@modules/farming/helpers';
import { isUndefined } from '@shared/helpers';
import { Undefined } from '@shared/types';

import { useFarmingItemStore } from '../stores';

const TIME_LOCK_ENDS = 0;

const getTimeout = (itemEndTime: Undefined<string>, lastStaked: Undefined<Date>, timelock: Undefined<string>) => {
  if (isUndefined(itemEndTime) || isUndefined(lastStaked) || isUndefined(timelock)) {
    return null;
  }

  const lastStakedTime = lastStaked.getTime();
  const endTimestamp = lastStakedTime + Number(timelock) * MS_IN_SECOND;
  const minEndTime = getMinEndTime(itemEndTime, endTimestamp) ?? TIME_LOCK_ENDS;

  return Math.max(minEndTime - Date.now(), TIME_LOCK_ENDS);
};

export const useFarmingTimeout = () => {
  const { item, userInfoStore } = useFarmingItemStore();
  const timelock = item?.timelock;
  const itemEndTime = item?.endTime;
  const lastStaked = userInfoStore.data?.last_staked;

  const timeout = getTimeout(itemEndTime, lastStaked, timelock);

  return { timeout, isUnlocked: timeout === TIME_LOCK_ENDS };
};
