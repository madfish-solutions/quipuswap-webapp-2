import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { isNull } from '@shared/helpers';
import { Nullable, Token } from '@shared/types';

import { getCoinflipStorageApi } from './get-coinflip-storage.api';
import { CoinflipStorage } from './types';
import { getCoinflipAssetId } from '../helpers';
import { GamersStatsRaw } from '../interfaces';

export const getGamersStatsApi = async (tezos: Nullable<TezosToolkit>, accountPkh: Nullable<string>, token: Token) => {
  if (isNull(tezos) || isNull(accountPkh)) {
    return null;
  }

  const coinFlipStorage = await getCoinflipStorageApi<CoinflipStorage>(tezos);

  if (isNull(coinFlipStorage)) {
    return null;
  }
  const tokenAsset = getCoinflipAssetId(token);

  const gamerStats = await coinFlipStorage.gamers_stats.get<GamersStatsRaw>([accountPkh, new BigNumber(tokenAsset)]);

  if (!gamerStats) {
    return null;
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
