import { BigNumber } from 'bignumber.js';

import { HOT_POOLS } from '@config/config';

export const isHotPool = (id: BigNumber, type: string) => {
  return HOT_POOLS.some(item => item.id === id.toString() && item.type === type);
};
