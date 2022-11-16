import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import { Trade, getPairFeeRatio } from 'swap-router-sdk';

import { isNull, isUndefined } from '@shared/helpers';
import { Nullable, Undefined } from '@shared/types';

import { calculateInputWithFee } from './calculate-input-with-fee';
import { getDevFeeRatio } from './get-dev-fee-ratio';
import { getInputTokenSlug } from './get-input-token-slug';

export const getUserRouteFeesAndSlug = (
  tezos: Nullable<TezosToolkit>,
  routes: Nullable<Trade>,
  inputAmount: Undefined<BigNumber>
) => {
  if (isNull(tezos) || isNull(routes) || isUndefined(inputAmount)) {
    return [];
  }

  let _inputAmount = inputAmount;

  return routes.map(route => {
    const tokenSlug = getInputTokenSlug(route);
    const feeRatio = getPairFeeRatio(route);
    const devFeeRatio = getDevFeeRatio(route);
    const inputWithFee = calculateInputWithFee(_inputAmount, feeRatio, devFeeRatio);
    const fee = _inputAmount.minus(inputWithFee);
    _inputAmount = inputWithFee;

    return {
      tokenSlug,
      fee
    };
  });
};
