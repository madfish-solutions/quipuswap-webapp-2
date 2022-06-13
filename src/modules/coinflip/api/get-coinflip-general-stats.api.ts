import { TezosToolkit } from '@taquito/taquito';

import { getStorageInfo } from '@shared/dapp';
import { isNull } from '@shared/helpers';
import { Token } from '@shared/types';

import { getTokenAssetById } from '../helpers';
import { CoinflipStorage, GeneralStatsInterface } from './types';

export const getCoinflipGeneralStatsApi = async (
  tezos: Nullable<TezosToolkit>,
  contractAddress: string,
  token: Token
): Promise<Nullable<GeneralStatsInterface>> => {
  if (isNull(tezos)) {
    return null;
  }

  const tokenAsset = getTokenAssetById(token);
  const storage = await getStorageInfo<CoinflipStorage>(tezos, contractAddress);

  return (await storage.id_to_asset.get<GeneralStatsInterface>(tokenAsset)) ?? null;
};
