import { TezosToolkit } from '@taquito/taquito';

import { getUserBalance } from '@blockchain';
import { FARMING_CONTRACT_ADDRESS, FARMING_API_URL } from '@config/config';
import { bigNumberToString, isNull } from '@shared/helpers';
import { Nullable } from '@shared/types';

import { getUserFarmBalances } from '../helpers';
import { FarmingContractStorageWrapper, RawFarmingItem, FarmingListResponse } from '../interfaces';

const FARMING_LIST_API_URL = `${FARMING_API_URL}/list`;

const farmingListFetch = async () => {
  const response = await fetch(FARMING_LIST_API_URL);
  const data = (await response.json()) as FarmingListResponse;

  return data.list;
};

interface UserBalances {
  myBalance: string;
  depositBalance?: string;
  earnBalance?: string;
}

const injectBalance = async (list: Array<RawFarmingItem>, accountPkh: string, tezos: TezosToolkit) => {
  const balances: Map<string, UserBalances> = new Map();
  const wrapStorage = await (
    await tezos.contract.at(FARMING_CONTRACT_ADDRESS)
  ).storage<FarmingContractStorageWrapper>();

  const storage = wrapStorage.storage;

  await Promise.all(
    list.map(async item => {
      const { stakedToken } = item;
      const { contractAddress, type, fa2TokenId } = stakedToken;

      const balanceBN = await getUserBalance(tezos, accountPkh, contractAddress, type, fa2TokenId);

      const balance = isNull(balanceBN) ? '0' : bigNumberToString(balanceBN);

      balances.set(item.id, { myBalance: balance });
    })
  );

  const userBalances = await getUserFarmBalances(accountPkh, storage, list);

  userBalances.forEach((userBalance, key) => {
    const balance = balances.get(key) as UserBalances;
    balances.set(key, { ...balance, ...userBalance });
  });

  return list.map(item => ({ ...item, ...balances.get(item.id) }));
};

export const getFarmingListApi = async (accountPkh: Nullable<string>, tezos: Nullable<TezosToolkit>) => {
  const fetchResult = await farmingListFetch();

  if (isNull(accountPkh) || isNull(tezos)) {
    return fetchResult;
  } else {
    return await injectBalance(fetchResult, accountPkh, tezos);
  }
};
