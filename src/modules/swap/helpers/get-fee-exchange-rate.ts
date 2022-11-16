import { BigNumber } from 'bignumber.js';

import { DASH, FISRT_INDEX } from '@config/constants';
import { isEqual } from '@shared/helpers';

export const getFeeExchangeRate = (exchangeRate: Record<string, BigNumber>, tokenSlug: string) =>
  isEqual(exchangeRate[tokenSlug], undefined)
    ? exchangeRate[tokenSlug.split(DASH)[FISRT_INDEX]]
    : exchangeRate[tokenSlug];
