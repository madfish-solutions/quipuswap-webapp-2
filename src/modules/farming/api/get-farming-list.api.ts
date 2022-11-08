import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { getUserBalance } from '@blockchain';
import { FARMING_CONTRACT_ADDRESS } from '@config/environment';
import { isEmptyArray, isNull, retry, saveBigNumber } from '@shared/helpers';
import { Nullable } from '@shared/types';

import { getUserFarmingBalances } from '../helpers';
import { FarmingContractStorageWrapper } from '../interfaces';
import { FarmingListItemModel } from '../models';

interface UserBalances {
  myBalance: string;
  depositBalance?: string;
  earnBalance?: string;
}

const injectBalance = async (list: Array<FarmingListItemModel>, accountPkh: string, tezos: TezosToolkit) => {
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

      balances.set(item.id, { myBalance: balance.toFixed() });
    })
  );

  const userBalances = await retry(async () => await getUserFarmingBalances(accountPkh, storage, list));

  userBalances.forEach((userBalance, key) => {
    const balance = balances.get(key) as UserBalances;
    balances.set(key, { ...balance, ...userBalance });
  });

  return {
    balances: list.map(item => ({ ...item, id: item.id, ...balances.get(item.id) }))
  };
};

export const getFarmingListUserBalances = async (
  accountPkh: Nullable<string>,
  tezos: Nullable<TezosToolkit>,
  farmings: Array<FarmingListItemModel>
) => {
  if (isNull(accountPkh) || isNull(tezos) || isEmptyArray(farmings)) {
    return { balances: [] };
  }

  return await injectBalance(farmings, accountPkh, tezos);
};
