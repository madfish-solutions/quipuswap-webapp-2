import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { STAKING_CONTRACT_ADDRESS } from '@app.config';
import { StakeContractStorageWrapper, UsersInfoValue } from '@interfaces/stake-contract.interface';
import { StakingItem } from '@interfaces/staking.interfaces';
import { getStorageInfo } from '@utils/dapp';

const ZERO = 0;

const DEFAULT_USER_INFO = {
  last_staked: new Date(ZERO).toISOString(),
  staked: new BigNumber(ZERO),
  earned: new BigNumber(ZERO),
  claimed: new BigNumber(ZERO),
  prev_earned: new BigNumber(ZERO),
  prev_staked: new BigNumber(ZERO),
  allowances: []
};

export const getUserInfoApi = async (
  item: StakingItem,
  accountPkh: string,
  tezos: TezosToolkit
): Promise<UsersInfoValue> => {
  const wrapStorage = await getStorageInfo<StakeContractStorageWrapper>(tezos, STAKING_CONTRACT_ADDRESS);

  const storage = wrapStorage.storage;
  const value = await storage.users_info.get([item.id, accountPkh]);

  return value ?? DEFAULT_USER_INFO;
};
