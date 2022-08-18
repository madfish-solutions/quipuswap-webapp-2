import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { isNull } from '@shared/helpers';
import { Token } from '@shared/types';

import { getCoinflipAssetId } from '../helpers';
import { GamersStatsRaw } from '../interfaces';
import { getCoinflipStorageApi } from './get-coinflip-storage.api';
import { CoinflipStorage } from './types';

export const DEFAULT_GAMERS_STATS = {
  lastGameId: null,
  gamesCount: null,
  totalWonAmount: null,
  totalLostAmount: null,
  totalBetsAmount: null
};

export const getGamersStatsApi = async (tezos: Nullable<TezosToolkit>, accountPkh: Nullable<string>, token: Token) => {
  if (isNull(tezos) || isNull(accountPkh)) {
    return DEFAULT_GAMERS_STATS;
  }

  const coinFlipStorage = await getCoinflipStorageApi<CoinflipStorage>(tezos);

  if (isNull(coinFlipStorage)) {
    return DEFAULT_GAMERS_STATS;
  }
  const tokenAsset = getCoinflipAssetId(token);

  const gamerStats = await coinFlipStorage.gamers_stats.get<GamersStatsRaw>([accountPkh, new BigNumber(tokenAsset)]);

  if (!gamerStats) {
    return DEFAULT_GAMERS_STATS;
  }

  const {
    last_game_id: lastGameId,
    games_count: gamesCount,
    total_won_amt: totalWonAmount,
    total_lost_amt: totalLostAmount,
    total_bets_amt: totalBetsAmount
  } = gamerStats;

  return {
    lastGameId,
    gamesCount,
    totalWonAmount,
    totalLostAmount,
    totalBetsAmount
  };
};
