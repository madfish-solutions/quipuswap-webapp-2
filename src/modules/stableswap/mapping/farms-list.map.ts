import { RawStableFarmItem, StableFarmItem } from '../types';
import { farmItemMapper } from './farm-item.map';

export const farmsListMapper = (list: Array<RawStableFarmItem>): Array<StableFarmItem> => list.map(farmItemMapper);
