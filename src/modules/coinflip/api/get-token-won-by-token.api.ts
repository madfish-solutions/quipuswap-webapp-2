import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { fromDecimals, isNull } from '@shared/helpers';
import { Token } from '@shared/types';

import { getCoinflipAssetId } from '../helpers';
import { GamersStatsRaw } from '../interfaces';
import { getCoinflipStorageApi } from './get-coinflip-storage.api';
import { CoinflipStorage } from './types';

export const getTokenWonByTokenApi = async (tezos: Nullable<TezosToolkit>, accountPkh: string, token: Token) => {
  const tokenAsset = getCoinflipAssetId(token);

  const coinFlipStorage = await getCoinflipStorageApi<CoinflipStorage>(tezos);

  if (isNull(coinFlipStorage)) {
    return { token, amount: new BigNumber('0') };
  }

  const stats = await coinFlipStorage.gamers_stats.get<GamersStatsRaw>([accountPkh, new BigNumber(tokenAsset)]);
  const amount = stats ? fromDecimals(stats.total_won_amt, token) : null;

  return { token, amount };
};
