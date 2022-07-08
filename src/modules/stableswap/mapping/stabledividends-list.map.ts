import { RawStableDividendsItem, StableDividendsItem } from '../types';
import { stableDividendsItemMapper } from './stabledividends-item.map';

export const stableDividendsListMapper = (list: Array<RawStableDividendsItem>): Array<StableDividendsItem> =>
  list.map(stableDividendsItemMapper);
