import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { MS_IN_SECOND } from '@config/constants';
import { getStorageInfo } from '@shared/dapp';
import { getLastElement, isNull, isUndefined } from '@shared/helpers';

import { YouvesFarmStakes, YouvesFarmStorage } from './types';

const NO_DUE_DATE = 0;

export const getRewardsDueDate = async (
  tezos: Nullable<TezosToolkit>,
  accountPkh: Nullable<string>,
  contractAddress: string
) => {
  if (isNull(tezos) || isNull(accountPkh)) {
    return NO_DUE_DATE;
  }

  const storage = await getStorageInfo<YouvesFarmStorage>(tezos, contractAddress);
  const ids: Array<BigNumber> = (await storage.stakes_owner_lookup.get(accountPkh)) ?? [];
  const { max_release_period } = storage;
  const ageTimestamp =
    (await storage.stakes.get<YouvesFarmStakes>(Number(getLastElement(ids))))?.age_timestamp ?? undefined;

  if (isUndefined(ageTimestamp)) {
    return NO_DUE_DATE;
  }

  return new Date(ageTimestamp).getTime() + max_release_period.multipliedBy(MS_IN_SECOND).toNumber();
};