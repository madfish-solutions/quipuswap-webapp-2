import BigNumber from 'bignumber.js';

import { defined, toReal } from '@shared/helpers';
import { Nullable } from '@shared/types';

import { mapFarmingLog } from '../mapping';
import { FarmingItemModel } from '../models';

export const getStakeUnstakeLogData = (
  farmingItem: FarmingItemModel & { depositBalance: Nullable<BigNumber>; earnBalance: Nullable<BigNumber> },
  balance: BigNumber,
  timeout: Nullable<number>,
  isUnlocked: boolean
) => {
  const token = defined(farmingItem).stakedToken;
  const realTokenBalance = toReal(balance, token);

  return { farming: { ...mapFarmingLog(farmingItem, realTokenBalance), timeout, isUnlocked } };
};
