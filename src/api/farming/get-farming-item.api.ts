import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { FARMING_CONTRACT_ADDRESS, FARMING_API_URL } from '@app.config';
import { FarmingContractStorageWrapper } from '@interfaces/farming-contract.interface';
import { RawFarmingItem, FarmingItemResponse } from '@interfaces/farming.interfaces';
import { isNull } from '@utils/helpers';
import { Nullable } from '@utils/types';
import { AuthStore } from 'stores/auth.store';

import { getBalances } from './helpers';

const FARMING_LIST_API_URL = `${FARMING_API_URL}/list`;

export const getFarmingItemFetch = async (farmingId: Nullable<BigNumber>) => {
  if (!farmingId) {
    throw new Error('Failed to get nullable farmingId');
  }

  const response = await fetch(`${FARMING_LIST_API_URL}/${farmingId.toFixed()}`);

  const data = (await response.json()) as FarmingItemResponse;

  return data.item;
};

const injectBalance = async (item: RawFarmingItem, accountPkh: string, tezos: TezosToolkit) => {
  const wrapStorage = await (
    await tezos.contract.at(FARMING_CONTRACT_ADDRESS)
  ).storage<FarmingContractStorageWrapper>();

  const storage = wrapStorage.storage;

  const usersInfoValue = await storage.users_info.get([new BigNumber(item.id), accountPkh]);

  const balances = getBalances(usersInfoValue, item);

  return { ...item, ...balances };
};

export const getFarmingItemApi = async (
  farmingId: Nullable<BigNumber>,
  authStore: AuthStore, //avoid race condition
  tezos: Nullable<TezosToolkit>
) => {
  const fetchResult = await getFarmingItemFetch(farmingId);
  const { accountPkh } = authStore;

  if (isNull(accountPkh) || isNull(tezos)) {
    return fetchResult;
  } else {
    return await injectBalance(fetchResult, accountPkh, tezos);
  }
};
