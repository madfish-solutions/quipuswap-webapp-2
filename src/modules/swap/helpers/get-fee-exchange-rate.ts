import { BigNumber } from 'bignumber.js';

import { DASH } from '@config/constants';
import { getFirstElement, isUndefined } from '@shared/helpers';

export const getFeeExchangeRate = (exchangeRate: Record<string, BigNumber>, tokenSlug: string) =>
  isUndefined(exchangeRate[tokenSlug]) ? exchangeRate[getFirstElement(tokenSlug.split(DASH))] : exchangeRate[tokenSlug];
