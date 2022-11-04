import { NEW_FARMINGS } from '@config/config';

import { FarmingItemModel } from '../models';

export const isNewFarming = (item: FarmingItemModel) =>
  NEW_FARMINGS.some(({ id, version }) => id === item.id.toFixed() && version === item.version);
