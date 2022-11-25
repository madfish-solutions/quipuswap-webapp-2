import { BigNumber } from 'bignumber.js';

import { UNDERSCORE } from '@config/constants';
import { getFirstElement, isUndefined } from '@shared/helpers';

export const getFeeExchangeRate = (exchangeRate: Record<string, BigNumber>, tokenSlug: string) =>
  isUndefined(exchangeRate[tokenSlug])
    ? exchangeRate[getFirstElement(tokenSlug.split(UNDERSCORE))]
    : exchangeRate[tokenSlug];
