import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { FARMING_CONTRACT_ADDRESS } from '@config/environment';
import { getStorageInfo } from '@shared/dapp';
import { Nullable } from '@shared/types';

import { DEFAULT_RAW_USER_INFO, getV1FarmsUserInfo } from '../helpers';
import { FarmingContractStorageWrapper, IRawUsersInfoValue } from '../interfaces';
import { FarmingItemV1Model } from '../models';

export const getUserInfoApi = async (
  item: FarmingItemV1Model,
  accountPkh: string,
  tezos: TezosToolkit
): Promise<IRawUsersInfoValue> => {
  const wrapStorage = await getStorageInfo<FarmingContractStorageWrapper>(tezos, FARMING_CONTRACT_ADDRESS);
  const storage = wrapStorage.storage;
  const value = await storage.users_info.get([new BigNumber(item.id), accountPkh]);

  return value ?? DEFAULT_RAW_USER_INFO;
};

export const getAllFarmsUserInfoApi = async (
  tezos: TezosToolkit,
  accountPkh: string,
  farmsWithBalancesIds: Nullable<Array<BigNumber>> = null
) => {
  const wrapStorage = await getStorageInfo<FarmingContractStorageWrapper>(tezos, FARMING_CONTRACT_ADDRESS);
  const storage = wrapStorage.storage;

  return await getV1FarmsUserInfo(storage, accountPkh, farmsWithBalancesIds);
};
