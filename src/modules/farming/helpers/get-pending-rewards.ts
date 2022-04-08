import BigNumber from 'bignumber.js';

import { isExist } from '@shared/helpers';
import { Nullable } from '@shared/types';

const ZERO_AMOUNT = 0;

export const getPendingRewards = (rewardsInUsd: Nullable<BigNumber>[]) => {
  if (rewardsInUsd.some(isExist)) {
    return rewardsInUsd.reduce<BigNumber>(
      (prevValue, currentValue) => prevValue.plus(currentValue ?? ZERO_AMOUNT),
      new BigNumber(ZERO_AMOUNT)
    );
  }

  return new BigNumber(ZERO_AMOUNT);
};
