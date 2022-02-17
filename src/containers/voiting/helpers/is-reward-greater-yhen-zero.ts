import BigNumber from 'bignumber.js';

import { Nullable } from '@interfaces/types';

const Zero = new BigNumber(0);

export const isRewardGreaterThenZero = (reward: Nullable<string>): boolean => {
  if (reward === null) {
    return false;
  } else {
    return new BigNumber(reward).gt(Zero);
  }
};
