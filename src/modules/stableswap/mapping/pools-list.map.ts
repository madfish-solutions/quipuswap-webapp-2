import { RawStableswapItem, StableswapItem } from '../types';
import { poolItemMapper } from './pool-item.map';

export const poolsListMapper = (list: Array<RawStableswapItem>): Array<StableswapItem> => list.map(poolItemMapper);
