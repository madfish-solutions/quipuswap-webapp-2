import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { ZERO_AMOUNT } from '@config/constants';
import { getTokenMetadata } from '@shared/api';
import { getStorageInfo } from '@shared/dapp';
import { isNull, isUndefined } from '@shared/helpers';
import { Undefined } from '@shared/types';

import { YouvesFarmStakes, YouvesFarmStorage } from './types';

const ZERO_BN = new BigNumber(ZERO_AMOUNT);

export const getTotalDeposit = async (
  tezos: Nullable<TezosToolkit>,
  accountPkh: Nullable<string>,
  contractAddress: Undefined<string>
) => {
  if (isNull(tezos) || isNull(accountPkh) || isUndefined(contractAddress)) {
    return ZERO_BN;
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

  const depositTokenMetadata = await getTokenMetadata({
    contractAddress: deposit_token.address,
    fa2TokenId: Number(deposit_token.id)
  });
  const depositTokenDecimals = depositTokenMetadata?.decimals ?? ZERO_AMOUNT;
  const depositTokenPrecision = Number(`1e${depositTokenDecimals}`);

  return userArrayStakes
    .reduce((prev, curr) => {
      return prev.plus(curr?.stake ?? ZERO_BN);
    }, ZERO_BN)
    .dividedBy(depositTokenPrecision)
    .decimalPlaces(depositTokenDecimals);
};
