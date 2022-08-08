/* eslint-disable import/order,  import/no-unresolved */
import BigNumber from 'bignumber.js';
import { TezosToolkit } from '@taquito/taquito';

import { FARMING_CONTRACT_ADDRESS } from '@config/environment';
import { getStorageInfo } from '@shared/dapp';

import { FarmingStorage } from '../interfaces';

export const getUserFarmingDelegate = async (tezos: TezosToolkit, accountPkh: string, id: BigNumber) => {
  const {
    storage: { candidates }
  } = await getStorageInfo<FarmingStorage>(tezos, FARMING_CONTRACT_ADDRESS);

  return (await candidates.get<string>([id, accountPkh])) ?? null;
};
