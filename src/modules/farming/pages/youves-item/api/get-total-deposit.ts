import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { ZERO_AMOUNT_BN } from '@config/constants';
import { getStorageInfo } from '@shared/dapp';
import { isNull, isUndefined } from '@shared/helpers';
import { Undefined } from '@shared/types';

import { getTokenDecimalsAndPrecision } from '../helpers';
import { YouvesFarmStakes, YouvesFarmStorage } from './types';

export const getTotalDeposit = async (
  tezos: Nullable<TezosToolkit>,
  accountPkh: Nullable<string>,
  contractAddress: Undefined<string>
) => {
  if (isNull(tezos) || isNull(accountPkh) || isUndefined(contractAddress)) {
    return ZERO_AMOUNT_BN;
  }

  const { stakes_owner_lookup, stakes, deposit_token } = await getStorageInfo<YouvesFarmStorage>(
    tezos,
    contractAddress
  );

  const ids: Array<BigNumber> = (await stakes_owner_lookup.get(accountPkh)) ?? [];
  const stakesArrayPromise = ids.map(async (id: BigNumber) => {
    return stakes.get<YouvesFarmStakes>(Number(id));
  });
  const userArrayStakes = await Promise.all(stakesArrayPromise);

  const { tokenDecimals, tokenPrecision } = await getTokenDecimalsAndPrecision(deposit_token.address, deposit_token.id);

  return userArrayStakes
    .reduce((prev, curr) => {
      return prev.plus(curr?.stake ?? ZERO_AMOUNT_BN);
    }, ZERO_AMOUNT_BN)
    .dividedBy(tokenPrecision)
    .decimalPlaces(tokenDecimals);
};
