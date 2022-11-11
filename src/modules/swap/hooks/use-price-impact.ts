import { Trade } from 'swap-router-sdk';

import { getPriceImpact, isNotEmptyArray } from '@shared/helpers';
import { Nullable } from '@shared/types';

export const usePriceImpact = (trade: Nullable<Trade>) => (isNotEmptyArray(trade) ? getPriceImpact(trade) : null);
