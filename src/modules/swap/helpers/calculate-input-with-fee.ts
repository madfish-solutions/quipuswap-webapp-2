import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import { Trade } from 'swap-router-sdk';

import { isNull } from '@shared/helpers';
import { calculateValueWithPercent } from '@shared/helpers/calculate-value-with-percent';

import { mapRouteFee } from '../mapper';

export const calculateInputWithFee = async (
  tezos: Nullable<TezosToolkit>,
  route: Nullable<Trade>,
  inputAmount: Nullable<BigNumber>
) => {
  if (isNull(tezos) || isNull(route) || isNull(inputAmount)) {
    return;
  }

  const fees = route.map(async ({ dexType, dexAddress }) => mapRouteFee(tezos, dexType, dexAddress));
  const preparedFees = (await Promise.all(fees)).flat();

  const calculatedValue = preparedFees.reduce(
    async (prev, curr) => calculateValueWithPercent(await prev, curr),
    Promise.resolve(inputAmount)
  );

  return await calculatedValue;
};
