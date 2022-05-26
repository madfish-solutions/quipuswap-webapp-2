import { TezosToolkit } from '@taquito/taquito';

import { DEFAULT_TOKEN } from '@config/tokens';
import { getStorageInfo } from '@shared/dapp';
import { isEqual, isNull } from '@shared/helpers';

import { CoinflipStorage, GeneralStatsInterface } from './types';

enum TOKEN_ASSETS {
  TEZOS = 0,
  QUIPU = 1
}

export const getCoinflipGeneralStatsApi = async (
  tezos: Nullable<TezosToolkit>,
  contractAddress: string,
  tokenAddress: string
): Promise<Nullable<GeneralStatsInterface>> => {
  if (isNull(tezos)) {
    return null;
  }
  const tokenAsset = isEqual(tokenAddress, DEFAULT_TOKEN.contractAddress) ? TOKEN_ASSETS.QUIPU : TOKEN_ASSETS.TEZOS;
  const storage = await getStorageInfo<CoinflipStorage>(tezos, contractAddress);

  return (await storage.id_to_asset.get<GeneralStatsInterface>(tokenAsset)) ?? null;
};
