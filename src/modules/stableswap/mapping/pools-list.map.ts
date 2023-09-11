import { poolItemMapper } from './pool-item.map';
import { RawStableswapItem, StableswapItem } from '../types';

export const poolsListMapper = (list: Array<RawStableswapItem>): Array<StableswapItem> => list.map(poolItemMapper);
