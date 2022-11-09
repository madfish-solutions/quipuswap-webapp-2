import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { isNull } from '@shared/helpers';
import { Nullable, Token } from '@shared/types';

import { getCoinflipAssetId } from '../helpers';
import { GamersStatsRaw } from '../interfaces';
import { getCoinflipStorageApi } from './get-coinflip-storage.api';
import { CoinflipStorage } from './types';

export const getGamesCountByTokenApi = async (
  tezos: Nullable<TezosToolkit>,
  accountPkh: string,
  token: Token
): Promise<BigNumber> => {
  const coinflipStorage = await getCoinflipStorageApi<CoinflipStorage>(tezos);

  if (isNull(coinflipStorage)) {
    return new BigNumber('0');
  }

  const tokenAsset = getCoinflipAssetId(token);

  const gamesCount = await coinflipStorage.gamers_stats.get<GamersStatsRaw>([accountPkh, new BigNumber(tokenAsset)]);

  return gamesCount?.games_count ?? new BigNumber('0');
};
