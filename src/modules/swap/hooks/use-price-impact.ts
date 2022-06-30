import { Trade } from 'swap-router-sdk';

import { getPriceImpact, isNotEmptyArray } from '@shared/helpers';

export const usePriceImpact = (trade: Nullable<Trade>) => (isNotEmptyArray(trade) ? getPriceImpact(trade) : null);
