import { BigNumber } from 'bignumber.js';

import { RouteFeesAndSlug } from '../types';
import { getFeeExchangeRate } from './get-fee-exchange-rate';

export const getUserRouteFeesInDollars = (
  userRouteFeesAndSlug: Array<RouteFeesAndSlug>,
  exchangeRate: Record<string, BigNumber>
) =>
  userRouteFeesAndSlug.map(({ tokenSlug, fee, devFee }) => {
    const feeExchangeRate = getFeeExchangeRate(exchangeRate, tokenSlug);

    return { fee: fee.multipliedBy(feeExchangeRate), devFee: devFee.multipliedBy(feeExchangeRate) };
  });
