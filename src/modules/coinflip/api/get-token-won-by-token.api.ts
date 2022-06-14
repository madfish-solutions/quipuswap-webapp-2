import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { fromDecimals } from '@shared/helpers';
import { Token } from '@shared/types';

import { getTokenAssetId } from '../helpers';
import { getCoinflipStorageApi } from './get-coinflip-storage.api';
import { CoinflipStorage, GamersStats } from './types';

export const getTokenWonByTokenApi = async (tezos: Nullable<TezosToolkit>, accountPkh: string, token: Token) => {
  const tokenAsset = getTokenAssetId(token);

  const { gamers_stats } = (await getCoinflipStorageApi(tezos)) as CoinflipStorage;
  const stats = (await gamers_stats.get([accountPkh, new BigNumber(tokenAsset)])) as GamersStats;
  const amount = stats ? fromDecimals(stats.total_won_amt, token) : null;

  return { token, amount };
};
