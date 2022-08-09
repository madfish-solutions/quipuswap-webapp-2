import { BigNumber } from 'bignumber.js';

import { HOT_POOLS } from '@config/config';
import { isEqual } from '@shared/helpers';

import { PoolType } from '../interfaces';

export const isHotPool = (id: BigNumber, type: string) => {
  return HOT_POOLS.includes(id.toString()) && isEqual(type, PoolType.DEX_TWO);
};
