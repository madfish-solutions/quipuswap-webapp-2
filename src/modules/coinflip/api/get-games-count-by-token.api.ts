import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { Token } from '@shared/types';

import { getTokenAsset } from '../helpers';
import { getCoinflipStorage } from './get-coinflip-storage.api';
import { CoinflipStorage, GamersStats } from './types';

export const getGamesCountByTokenApi = async (
  tezos: Nullable<TezosToolkit>,
  accountPkh: string,
  token: Token
): Promise<BigNumber> => {
  const tokenAsset = getTokenAsset(token);

  const { gamers_stats } = (await getCoinflipStorage(tezos)) as CoinflipStorage;
  const { games_count: gamesCount } = (await gamers_stats.get([accountPkh, new BigNumber(tokenAsset)])) as GamersStats;

  return gamesCount;
};
