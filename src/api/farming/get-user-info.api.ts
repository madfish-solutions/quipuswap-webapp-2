import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { FARMING_CONTRACT_ADDRESS } from '@app.config';
import { FarmingContractStorageWrapper, RawFarmingUserInfo } from '@interfaces/farming-contract.interface';
import { FarmingItem } from '@interfaces/farming.interfaces';
import { getStorageInfo } from '@utils/dapp';

const ZERO = 0;

const DEFAULT_USER_INFO: RawFarmingUserInfo = {
  last_staked: new Date().toISOString(),
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
): Promise<RawFarmingUserInfo> => {
  const wrapStorage = await getStorageInfo<FarmingContractStorageWrapper>(tezos, FARMING_CONTRACT_ADDRESS);

  const storage = wrapStorage.storage;
  const value = await storage.users_info.get([item.id, accountPkh]);

  return value ?? DEFAULT_USER_INFO;
};
