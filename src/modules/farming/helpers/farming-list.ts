import { ZERO_AMOUNT } from '@config/constants';

import { FarmingListItemWithBalances } from '../pages/list/types';

export const isStakedFarming = ({ earnBalance }: FarmingListItemWithBalances) => earnBalance?.gt(ZERO_AMOUNT);
