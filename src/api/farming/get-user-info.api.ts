import { TezosToolkit } from '@taquito/taquito';

import { FARMING_CONTRACT_ADDRESS } from '@app.config';
import { FarmingContractStorageWrapper, RawUsersInfoValue } from '@interfaces/farming-contract.interface';
import { FarmingItem } from '@interfaces/farming.interfaces';
import { getStorageInfo } from '@utils/dapp';

import { DEFAULT_RAW_USER_INFO, getAllFarmUserInfo } from './helpers';

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
