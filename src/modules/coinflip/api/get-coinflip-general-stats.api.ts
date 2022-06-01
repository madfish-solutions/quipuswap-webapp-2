import { TezosToolkit } from '@taquito/taquito';

import { DEFAULT_TOKEN } from '@config/tokens';
import { getStorageInfo } from '@shared/dapp';
import { isEqual, isNull } from '@shared/helpers';

import { TOKEN_ASSETS } from '../interfaces';
import { CoinflipStorage, GeneralStatsInterface } from './types';

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
