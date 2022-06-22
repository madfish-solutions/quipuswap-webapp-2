import { TezosToolkit } from '@taquito/taquito';

import { COINFLIP_CONTRACT_ADDRESS } from '@config/enviroment';
import { getStorageInfo } from '@shared/dapp';
import { isNull } from '@shared/helpers';

import { CoinflipStorage } from './types';

export const getCoinflipStorageApi = async (tezos: Nullable<TezosToolkit>) => {
  if (isNull(tezos)) {
    return null;
  }

  return await getStorageInfo<CoinflipStorage>(tezos, COINFLIP_CONTRACT_ADDRESS);
};
