import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { FARMING_CONTRACT_ADDRESS_OLD } from '@config/environment';
import { getStorageInfo } from '@shared/dapp';

import { DEFAULT_RAW_USER_INFO, getAllFarmUserInfo } from '../helpers';
import { FarmingContractStorageWrapper, RawUsersInfoValue } from '../interfaces';
import { FarmingItemModel } from '../models';

export const getUserInfoApi = async (
  item: FarmingItemModel,
  accountPkh: string,
  tezos: TezosToolkit
): Promise<RawUsersInfoValue> => {
  const wrapStorage = await getStorageInfo<FarmingContractStorageWrapper>(tezos, FARMING_CONTRACT_ADDRESS_OLD);
  const storage = wrapStorage.storage;
  const value = await storage.users_info.get([item.id, accountPkh]);

  return value ?? DEFAULT_RAW_USER_INFO;
};

export const getAllFarmsUserInfoApi = async (
  tezos: TezosToolkit,
  accountPkh: string,
  farmsWithBalancesIds: Nullable<Array<BigNumber>> = null
) => {
  const wrapStorage = await getStorageInfo<FarmingContractStorageWrapper>(tezos, FARMING_CONTRACT_ADDRESS_OLD);
  const storage = wrapStorage.storage;

  return await getAllFarmUserInfo(storage, accountPkh, farmsWithBalancesIds);
};
