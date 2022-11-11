import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { MS_IN_SECOND } from '@config/constants';
import { getStorageInfo } from '@shared/dapp';
import { getLastElementFromArray, isEmptyArray, isNull, isUndefined } from '@shared/helpers';
import { Nullable, Undefined } from '@shared/types';

import { YouvesFarmStorage } from './types';

const NO_DUE_DATE = 0;

export const getRewardsDueDate = async (
  tezos: Nullable<TezosToolkit>,
  accountPkh: Nullable<string>,
  contractAddress: Undefined<string>
) => {
  if (isNull(tezos) || isNull(accountPkh) || isUndefined(contractAddress)) {
    return NO_DUE_DATE;
  }

  const storage = await getStorageInfo<YouvesFarmStorage>(tezos, contractAddress);
  const ids: Array<BigNumber> = (await storage.stakes_owner_lookup.get(accountPkh)) ?? [];

  if (isEmptyArray(ids)) {
    return NO_DUE_DATE;
  }

  const { max_release_period } = storage;
  const ageTimestamp = (await storage.stakes.get(getLastElementFromArray(ids)))?.age_timestamp ?? undefined;

  if (isUndefined(ageTimestamp)) {
    return NO_DUE_DATE;
  }

  return new Date(ageTimestamp).getTime() + max_release_period.multipliedBy(MS_IN_SECOND).toNumber();
};
