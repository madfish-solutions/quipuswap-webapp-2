import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { STAKING_CONTRACT_ADDRESS, STALKING_API_URL } from '@app.config';
import { StakeContractStorageWrapper } from '@interfaces/stake-contract.interface';
import { RawStakingItem, StakeItemResponse } from '@interfaces/staking.interfaces';
import { isNull } from '@utils/helpers';
import { Nullable } from '@utils/types';
import { AuthStore } from 'stores/auth.store';

import { getBalances } from './helpers';

const STALKING_LIST_API_URL = `${STALKING_API_URL}/list`;

export const getStakingItemFetch = async (stakingId: Nullable<BigNumber>) => {
  if (!stakingId) {
    throw new Error('Failed to get nullable stakingId');
  }

  const response = await fetch(`${STALKING_LIST_API_URL}/${stakingId.toFixed()}`);

  const data = (await response.json()) as StakeItemResponse;

  return data.item;
};

const injectBalance = async (item: RawStakingItem, accountPkh: string, tezos: TezosToolkit) => {
  const wrapStorage = await (await tezos.contract.at(STAKING_CONTRACT_ADDRESS)).storage<StakeContractStorageWrapper>();

  const storage = wrapStorage.storage;

  const usersInfoValue = await storage.users_info.get([new BigNumber(item.id), accountPkh]);

  const balances = getBalances(usersInfoValue, item);

  return { ...item, ...balances };
};

export const getStakingItemApi = async (
  stakingId: Nullable<BigNumber>,
  authStore: AuthStore, //avoid race condition
  tezos: Nullable<TezosToolkit>
) => {
  const fetchResult = await getStakingItemFetch(stakingId);
  const { accountPkh } = authStore;

  if (isNull(accountPkh) || isNull(tezos)) {
    return fetchResult;
  } else {
    return await injectBalance(fetchResult, accountPkh, tezos);
  }
};
