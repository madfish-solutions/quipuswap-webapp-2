import { BigNumber } from 'bignumber.js';

import { ZERO_AMOUNT } from '@config/constants';

import { getFeeExchangeRate } from './get-fee-exchange-rate';
import { RouteFeesAndSlug } from '../types';

export const getUserRouteFeesInDollars = (
  userRouteFeesAndSlug: Array<RouteFeesAndSlug>,
  exchangeRate: Record<string, BigNumber>
) =>
  userRouteFeesAndSlug.map(({ tokenSlug, fee, devFee }) => {
    const feeExchangeRate = getFeeExchangeRate(exchangeRate, tokenSlug) ?? ZERO_AMOUNT;

    return { fee: fee.multipliedBy(feeExchangeRate), devFee: devFee.multipliedBy(feeExchangeRate) };
  });
