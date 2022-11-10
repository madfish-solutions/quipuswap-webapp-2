import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { FARMING_CONTRACT_ADDRESS } from '@config/environment';
import { getStorageInfo } from '@shared/dapp';

import { FarmingStorage } from '../interfaces';

export const getUserFarmingDelegate = async (tezos: TezosToolkit, accountPkh: string, id: string) => {
  const {
    storage: { candidates }
  } = await getStorageInfo<FarmingStorage>(tezos, FARMING_CONTRACT_ADDRESS);

  return (await candidates.get<string>([new BigNumber(id), accountPkh])) ?? null;
};
