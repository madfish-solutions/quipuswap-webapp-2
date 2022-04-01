import { TezosToolkit } from '@taquito/taquito';

import { FARMING_CONTRACT_ADDRESS } from '@config/config';
import { getStorageInfo } from '@shared/dapp';

import { DEFAULT_RAW_USER_INFO, getAllFarmUserInfo } from '../helpers';
import { FarmingContractStorageWrapper, FarmingItem, RawUsersInfoValue } from '../interfaces';

export const getUserInfoApi = async (
  item: FarmingItem,
  accountPkh: string,
  tezos: TezosToolkit
): Promise<RawUsersInfoValue> => {
  const wrapStorage = await getStorageInfo<FarmingContractStorageWrapper>(tezos, FARMING_CONTRACT_ADDRESS);
  const storage = wrapStorage.storage;
  const value = await storage.users_info.get([item.id, accountPkh]);

  return value ?? DEFAULT_RAW_USER_INFO;
};

export const getAllFarmsUserInfoApi = async (tezos: TezosToolkit, accountPkh: string) => {
  const wrapStorage = await getStorageInfo<FarmingContractStorageWrapper>(tezos, FARMING_CONTRACT_ADDRESS);
  const storage = wrapStorage.storage;

  return await getAllFarmUserInfo(storage, accountPkh);
};
