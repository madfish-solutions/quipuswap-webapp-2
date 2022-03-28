import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { FARMING_CONTRACT_ADDRESS } from '@config';
import { getStorageInfo } from '@shared/dapp';

import { FarmingContractStorageWrapper, UsersInfoValue, FarmingItem } from '../interfaces';

const ZERO = 0;

const DEFAULT_USER_INFO: UsersInfoValue = {
  last_staked: new Date(ZERO).toISOString(),
  staked: new BigNumber(ZERO),
  earned: new BigNumber(ZERO),
  claimed: new BigNumber(ZERO),
  prev_earned: new BigNumber(ZERO),
  prev_staked: new BigNumber(ZERO),
  allowances: []
};

export const getUserInfoApi = async (
  item: FarmingItem,
  accountPkh: string,
  tezos: TezosToolkit
): Promise<UsersInfoValue> => {
  const wrapStorage = await getStorageInfo<FarmingContractStorageWrapper>(tezos, FARMING_CONTRACT_ADDRESS);

  const storage = wrapStorage.storage;
  const value = await storage.users_info.get([item.id, accountPkh]);

  return value ?? DEFAULT_USER_INFO;
};
