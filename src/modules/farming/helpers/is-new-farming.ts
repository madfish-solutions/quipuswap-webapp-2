import { NEW_FARMINGS } from '@config/config';

import { FarmingListItemModel } from '../models';

export const isNewFarming = (item: FarmingListItemModel) =>
  NEW_FARMINGS.some(({ id, version }) => id === item.id && version === item.version);
