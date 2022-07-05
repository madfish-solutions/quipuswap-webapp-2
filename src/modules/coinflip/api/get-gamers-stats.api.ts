import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { isNull } from '@shared/helpers';
import { Token } from '@shared/types';

import { getCoinflipAssetId } from '../helpers';
import { GamersStatsRaw } from '../interfaces';
import { getCoinflipStorageApi } from './get-coinflip-storage.api';
import { CoinflipStorage } from './types';

export const getGamersStatsApi = async (tezos: Nullable<TezosToolkit>, accountPkh: Nullable<string>, token: Token) => {
  if (isNull(tezos) || isNull(accountPkh)) {
    return null;
  }

  const tokenAsset = getCoinflipAssetId(token);

  const coinFlipStorage = await getCoinflipStorageApi<CoinflipStorage>(tezos);

  if (isNull(coinFlipStorage)) {
    return null;
  }

  const gamerStats = await coinFlipStorage.gamers_stats.get<GamersStatsRaw>([accountPkh, new BigNumber(tokenAsset)]);

  return gamerStats ?? null;
};
