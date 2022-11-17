import BigNumber from 'bignumber.js';

import { defined, toReal } from '@shared/helpers';
import { Nullable } from '@shared/types';

import { mapFarmingLog } from '../mapping';
import { FarmingItemV1WithBalances } from '../pages/list/types';

export const getStakeUnstakeLogData = (
  farmingItem: FarmingItemV1WithBalances,
  balance: BigNumber,
  timeout: Nullable<number>,
  isUnlocked: boolean
) => {
  const token = defined(farmingItem).stakedToken;
  const realTokenBalance = toReal(balance, token);

  return { farming: { ...mapFarmingLog(farmingItem, realTokenBalance), timeout, isUnlocked } };
};
