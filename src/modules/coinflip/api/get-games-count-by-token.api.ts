import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { isNull } from '@shared/helpers';
import { Token } from '@shared/types';

import { getCoinflipAssetId } from '../helpers';
import { getCoinflipStorageApi } from './get-coinflip-storage.api';
import { CoinflipStorage, GamersStats } from './types';

export const getGamesCountByTokenApi = async (
  tezos: Nullable<TezosToolkit>,
  accountPkh: string,
  token: Token
): Promise<BigNumber> => {
  const tokenAsset = getCoinflipAssetId(token);

  const coinflipStorage = await getCoinflipStorageApi<CoinflipStorage>(tezos);

  if (isNull(coinflipStorage)) {
    return new BigNumber('0');
  }

  const gamesCount = await coinflipStorage.gamers_stats.get<GamersStats>([accountPkh, new BigNumber(tokenAsset)]);

  return gamesCount?.games_count ?? new BigNumber('0');
};
