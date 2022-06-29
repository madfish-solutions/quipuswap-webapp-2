import { RawStableDividendsItem, StableDividendsItem } from '../types';
import { farmItemMapper } from './farm-item.map';

export const farmsListMapper = (list: Array<RawStableDividendsItem>): Array<StableDividendsItem> =>
  list.map(farmItemMapper);
