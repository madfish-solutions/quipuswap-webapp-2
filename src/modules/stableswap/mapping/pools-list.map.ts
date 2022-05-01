import { RawStableswapList, StableswapList } from '../types';
import { poolItemMapper } from './pool-item.map';

export const poolsListMapper = (list: RawStableswapList['list']): StableswapList['list'] => {
  return list.map(poolItemMapper);
};
