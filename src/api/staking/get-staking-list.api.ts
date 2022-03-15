import { TezosToolkit } from '@taquito/taquito';

import { getUserBalance } from '@api/get-user-balance';
import { STALKING_API_URL } from '@app.config';
import { RawStakingItem } from '@interfaces/staking.interfaces';
import { bigNumberToString, isNull } from '@utils/helpers';
import { Nullable } from '@utils/types';

const STALKING_LIST_API_URL = `${STALKING_API_URL}/list`;

const stakingListFetch = async (accountPkh: Nullable<string>) => {
  const headers = new Headers({
    'content-type': 'application/json'
  });
  if (accountPkh) {
    headers.append('account-pkh', accountPkh);
  }
  const res = await fetch(STALKING_LIST_API_URL, {
    headers
  });

  return (await res.json()) as RawStakingItem[];
};

const injectBalance = async (list: Array<RawStakingItem>, accountPkh: string, tezos: TezosToolkit) => {
  const balances: Map<string, string> = new Map();
  await Promise.all(
    list.map(async item => {
      const { stakedToken } = item;
      const { contractAddress, type, fa2TokenId } = stakedToken;

      const balanceBN = await getUserBalance(tezos, accountPkh, contractAddress, type, fa2TokenId);

      const balance = isNull(balanceBN) ? '0' : bigNumberToString(balanceBN);

      balances.set(item.id, balance);
    })
  );

  return list.map(item => ({ ...item, myBalance: balances.get(item.id) }));
};

export const getStakingListApi = async (accountPkh: Nullable<string>, tezos: Nullable<TezosToolkit>) => {
  const fetchResult = await stakingListFetch(accountPkh);

  if (isNull(accountPkh) || isNull(tezos)) {
    return fetchResult;
  } else {
    return await injectBalance(fetchResult, accountPkh, tezos);
  }
};
