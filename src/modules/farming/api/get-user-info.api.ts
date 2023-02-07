import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { FARMING_CONTRACT_ADDRESS } from '@config/environment';
import { getStorageInfo } from '@shared/dapp';

import { DEFAULT_RAW_USER_INFO } from '../helpers';
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
