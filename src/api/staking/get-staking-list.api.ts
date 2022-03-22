import { TezosToolkit } from '@taquito/taquito';

import { getUserBalance } from '@api/get-user-balance';
import { FARMING_CONTRACT_ADDRESS, STALKING_API_URL } from '@app.config';
import { StakeContractStorageWrapper } from '@interfaces/stake-contract.interface';
import { RawStakingItem, StakeListResponse } from '@interfaces/staking.interfaces';
import { bigNumberToString, isNull } from '@utils/helpers';
import { Nullable } from '@utils/types';

import { getUserFarmBalances } from './helpers';

const STALKING_LIST_API_URL = `${STALKING_API_URL}/list`;

const stakingListFetch = async () => {
  const response = await fetch(STALKING_LIST_API_URL);
  const data = (await response.json()) as StakeListResponse;

  return data.list;
};

export interface UserBalances {
  myBalance: string;
  depositBalance?: string;
  earnBalance?: string;
}

const injectBalance = async (list: Array<RawStakingItem>, accountPkh: string, tezos: TezosToolkit) => {
  const balances: Map<string, UserBalances> = new Map();
  const wrapStorage = await (await tezos.contract.at(FARMING_CONTRACT_ADDRESS)).storage<StakeContractStorageWrapper>();

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

export const getStakingListApi = async (accountPkh: Nullable<string>, tezos: Nullable<TezosToolkit>) => {
  const fetchResult = await stakingListFetch();

  if (isNull(accountPkh) || isNull(tezos)) {
    return fetchResult;
  } else {
    return await injectBalance(fetchResult, accountPkh, tezos);
  }
};
