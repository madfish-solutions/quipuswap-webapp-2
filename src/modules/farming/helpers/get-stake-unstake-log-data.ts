import BigNumber from 'bignumber.js';

import { defined, fromDecimals } from '@shared/helpers';
import { Nullable } from '@shared/types';

import { FarmingItem } from '../interfaces';
import { mapFarmingLog } from '../mapping';

export const getStakeUnstakeLogData = (
  farmingItem: FarmingItem,
  balance: BigNumber,
  timeout: Nullable<number>,
  isUnlocked: boolean
) => {
  const token = defined(farmingItem).stakedToken;
  const inputAmountWithDecimals = fromDecimals(balance, token);

  return { farming: { ...mapFarmingLog(farmingItem, inputAmountWithDecimals), timeout, isUnlocked } };
};
