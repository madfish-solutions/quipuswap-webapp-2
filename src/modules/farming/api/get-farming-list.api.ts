import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { getUserBalance } from '@blockchain';
import { FARMING_LIST_API_URL } from '@config/constants';
import { FARMING_CONTRACT_ADDRESS } from '@config/environment';
import { isEmptyArray, isNull, saveBigNumber } from '@shared/helpers';
import { Nullable } from '@shared/types';

import { getUserFarmBalances } from '../helpers';
import { FarmingContractStorageWrapper, FarmingListResponse } from '../interfaces';
import { FarmingItemModel } from '../models';

//TODO: change name
export const farmingListFetch = async () => {
  const response = await fetch(FARMING_LIST_API_URL);

  return (await response.json()) as FarmingListResponse;
};

interface UserBalances {
  myBalance: string;
  depositBalance?: string;
  earnBalance?: string;
}

const injectBalance = async (list: Array<FarmingItemModel>, accountPkh: string, tezos: TezosToolkit) => {
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

      const balance = saveBigNumber(balanceBN, new BigNumber(0));

      balances.set(item.id.toFixed(), { myBalance: balance.toFixed() });
    })
  );

  const userBalances = await getUserFarmBalances(accountPkh, storage, list);

  userBalances.forEach((userBalance, key) => {
    const balance = balances.get(key) as UserBalances;
    balances.set(key, { ...balance, ...userBalance });
  });

  return { list: list.map(item => ({ id: item.id.toFixed(), ...balances.get(item.id.toFixed()) })) };
};

export const getFarmingListApi = async (
  accountPkh: Nullable<string>,
  tezos: Nullable<TezosToolkit>,
  farmings: Array<FarmingItemModel>
) => {
  if (isNull(accountPkh) || isNull(tezos) || isEmptyArray(farmings)) {
    return null;
  }

  return await injectBalance(farmings, accountPkh, tezos);
};
