import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { fromDecimals } from '@shared/helpers';
import { Token } from '@shared/types';

import { getTokenAsset } from '../helpers';
import { TokenWon } from '../types';
import { getCoinflipStorage } from './get-coinflip-storage.api';
import { CoinflipStorage, GamersStats } from './types';

export const getTokenWonByTokenApi = async (
  tezos: Nullable<TezosToolkit>,
  accountPkh: string,
  token: Token
): Promise<TokenWon> => {
  const tokenAsset = getTokenAsset(token);

  const { gamers_stats } = (await getCoinflipStorage(tezos)) as CoinflipStorage;
  const stats = (await gamers_stats.get([accountPkh, new BigNumber(tokenAsset)])) as GamersStats;
  const amount = stats ? fromDecimals(stats.total_won_amt, token) : null;

  return { token, amount };
};
