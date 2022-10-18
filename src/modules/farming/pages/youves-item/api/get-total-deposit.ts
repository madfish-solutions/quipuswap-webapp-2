import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { ZERO_AMOUNT } from '@config/constants';
import { getTokenMetadata } from '@shared/api';
import { getStorageInfo } from '@shared/dapp';
import { isNull } from '@shared/helpers';

import { YouvesFarmStakes, YouvesFarmStorage } from './types';

const ZERO_BN = new BigNumber(ZERO_AMOUNT);

export const getTotalDeposit = async (
  tezos: Nullable<TezosToolkit>,
  accountPkh: Nullable<string>,
  contractAddress: string
) => {
  if (isNull(tezos) || isNull(accountPkh)) {
    return ZERO_BN;
  }

  const { stakes_owner_lookup, stakes, deposit_token } = await getStorageInfo<YouvesFarmStorage>(
    tezos,
    contractAddress
  );

  const ids: Array<BigNumber> = (await stakes_owner_lookup.get(accountPkh)) ?? [];
  const userStakes = await Promise.all(
    ids.map(async (id: BigNumber) => {
      return (await stakes.get<YouvesFarmStakes>(Number(id)))?.stake ?? ZERO_BN;
    })
  );

  const depositTokenMetadata = await getTokenMetadata({
    contractAddress: deposit_token.address,
    fa2TokenId: Number(deposit_token.id)
  });
  const depositTokenDecimals = depositTokenMetadata?.decimals ?? ZERO_AMOUNT;
  const depositTokenPrecision = Number(`1e${depositTokenDecimals}`);

  return userStakes
    .reduce((prev, curr) => {
      return prev.plus(curr);
    }, ZERO_BN)
    .dividedBy(depositTokenPrecision)
    .decimalPlaces(depositTokenDecimals);
};
