import { BigNumber } from 'bignumber.js';

import { isExist } from '@shared/helpers';
import { getPercantageFromNumber } from '@shared/helpers/get-precantage-from-number';
import { Optional } from '@shared/types';

export const getUserReward = (rewardInAtomic: Optional<BigNumber>, fee: Optional<BigNumber>) => {
  if (!isExist(rewardInAtomic) || !isExist(fee)) {
    return null;
  }

  return rewardInAtomic.minus(getPercantageFromNumber(rewardInAtomic, fee));
};
