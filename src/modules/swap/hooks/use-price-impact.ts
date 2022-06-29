import { Trade } from 'swap-router-sdk';

import { getPriceImpact, isEmptyArray } from '@shared/helpers';

export const usePriceImpact = (trade: Nullable<Trade>) => (isEmptyArray(trade) ? null : getPriceImpact(trade!));
