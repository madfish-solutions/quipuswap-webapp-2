import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { getUserBalance } from '@blockchain';
import { FARMING_NEW_LIST_API_URL } from '@config/constants';
import { FARMING_CONTRACT_ADDRESS } from '@config/environment';
import { isEmptyArray, isNull, retry, saveBigNumber } from '@shared/helpers';
import { Nullable } from '@shared/types';

import { getUserFarmBalances, getUserFarmBalancesNew } from '../helpers';
import { FarmingContractStorageWrapper, FarmingListResponse } from '../interfaces';
import { FarmingItemCommonModel, FarmingItemModel } from '../models';

//TODO: change name
export const getFarmingListApi = async () => {
  const response = await fetch(FARMING_NEW_LIST_API_URL);

  return (await response.json()) as FarmingListResponse;
};

interface UserBalances {
  myBalance: string;
  depositBalance?: string;
  earnBalance?: string;
}

/** @deprecated */
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

      const balanceBN = await retry(
        async () => await getUserBalance(tezos, accountPkh, contractAddress, type, fa2TokenId)
      );

      const balance = saveBigNumber(balanceBN, new BigNumber(0));

      balances.set(item.id.toFixed(), { myBalance: balance.toFixed() });
    })
  );

  const userBalances = await retry(async () => await getUserFarmBalances(accountPkh, storage, list));

  userBalances.forEach((userBalance, key) => {
    const balance = balances.get(key) as UserBalances;
    balances.set(key, { ...balance, ...userBalance });
  });

  return { balances: list.map(item => ({ id: item.id.toFixed(), ...balances.get(item.id.toFixed()) })) };
};

// eslint-disable-next-line sonarjs/no-identical-functions
const injectBalanceNew = async (list: Array<FarmingItemCommonModel>, accountPkh: string, tezos: TezosToolkit) => {
  const balances: Map<string, UserBalances> = new Map();
  const wrapStorage = await (
    await tezos.contract.at(FARMING_CONTRACT_ADDRESS)
  ).storage<FarmingContractStorageWrapper>();

  const storage = wrapStorage.storage;

  await Promise.all(
    // eslint-disable-next-line sonarjs/no-identical-functions
    list.map(async item => {
      const { stakedToken } = item;
      const { contractAddress, type, fa2TokenId } = stakedToken;

      const balanceBN = await retry(
        async () => await getUserBalance(tezos, accountPkh, contractAddress, type, fa2TokenId)
      );

      const balance = saveBigNumber(balanceBN, new BigNumber(0));

      balances.set(item.id.toFixed(), { myBalance: balance.toFixed() });
    })
  );

  const userBalances = await retry(async () => await getUserFarmBalancesNew(accountPkh, storage, list));

  userBalances.forEach((userBalance, key) => {
    const balance = balances.get(key) as UserBalances;
    balances.set(key, { ...balance, ...userBalance });
  });

  return { balances: list.map(item => ({ id: item.id.toFixed(), ...balances.get(item.id.toFixed()) })) };
};

/** @deprecated */
export const getFarmingListUserBalances = async (
  accountPkh: Nullable<string>,
  tezos: Nullable<TezosToolkit>,
  farmings: Array<FarmingItemModel>
) => {
  if (isNull(accountPkh) || isNull(tezos) || isEmptyArray(farmings)) {
    return { balances: [] };
  }

  return await injectBalance(farmings, accountPkh, tezos);
};

export const getFarmingListUserBalancesNew = async (
  accountPkh: Nullable<string>,
  tezos: Nullable<TezosToolkit>,
  farmings: Array<FarmingItemCommonModel>
) => {
  if (isNull(accountPkh) || isNull(tezos) || isEmptyArray(farmings)) {
    return { balances: [] };
  }

  return await injectBalanceNew(farmings, accountPkh, tezos);
};
