import { BigNumber } from 'bignumber.js';

import { isExist, getPercentageFromNumber } from '@shared/helpers';
import { Optional } from '@shared/types';

export const getUserReward = (rewardInAtomic: Optional<BigNumber>, fee: Optional<BigNumber>) => {
  if (!isExist(rewardInAtomic) || !isExist(fee)) {
    return null;
  }

  return rewardInAtomic.minus(getPercentageFromNumber(rewardInAtomic, fee));
};
