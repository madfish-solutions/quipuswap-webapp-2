import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import { Trade, getPairFeeRatio } from 'swap-router-sdk';

import { isNull, isUndefined } from '@shared/helpers';
import { Nullable, Undefined } from '@shared/types';

import { RouteFeeAndSlug } from '../types';
import { getInputTokenSlug } from './get-input-token-slug';

export const getUserRouteFees = (
  tezos: Nullable<TezosToolkit>,
  routes: Nullable<Trade>,
  inputAmount: Undefined<BigNumber>
) => {
  if (isNull(tezos) || isNull(routes) || isUndefined(inputAmount)) {
    return [];
  }

  const userRouteFees: Array<RouteFeeAndSlug> = [];
  let _inputAmount = inputAmount;

  const routeFees = routes.map(route => ({
    tokenSlug: getInputTokenSlug(route),
    fee: getPairFeeRatio(route)
  }));

  routeFees.forEach(({ tokenSlug, fee }) => {
    const inputWithFee = _inputAmount.multipliedBy(fee);
    userRouteFees.push({ tokenSlug, fee: _inputAmount.minus(inputWithFee) });
    _inputAmount = inputWithFee;
  });

  return userRouteFees;
};
