import { HOT_POOLS } from '@config/config';
import { isEqual } from '@shared/helpers';

import { HotPoolInterface, PoolType } from '../interfaces';

export const isHotPool = (item: HotPoolInterface) => {
  return HOT_POOLS.includes(String(item.id)) && isEqual(item.type, PoolType.DEX_TWO);
};
