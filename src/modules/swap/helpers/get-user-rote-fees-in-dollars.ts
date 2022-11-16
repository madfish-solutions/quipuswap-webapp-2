import { BigNumber } from 'bignumber.js';

import { RouteFeeAndSlug } from '../types';
import { getFeeExchangeRate } from './get-fee-exchange-rate';

export const getUserRouteFeesInDollars = (
  userRouteFeesAndSlug: Array<RouteFeeAndSlug>,
  exchangeRate: Record<string, BigNumber>
) =>
  userRouteFeesAndSlug.map(({ tokenSlug, fee }) => {
    const feeExchangeRate = getFeeExchangeRate(exchangeRate, tokenSlug);

    return fee.multipliedBy(feeExchangeRate);
  });
