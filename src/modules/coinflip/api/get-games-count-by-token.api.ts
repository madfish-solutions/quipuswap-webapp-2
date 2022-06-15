import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

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

  const { gamers_stats } = (await getCoinflipStorageApi(tezos)) as CoinflipStorage;
  const { games_count: gamesCount } = (await gamers_stats.get([accountPkh, new BigNumber(tokenAsset)])) as GamersStats;

  return gamesCount;
};
