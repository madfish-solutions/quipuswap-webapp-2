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
  const { total_won_amt } = (await gamers_stats.get([accountPkh, new BigNumber(tokenAsset)])) as GamersStats;

  return { token: token, amount: fromDecimals(total_won_amt, token) };
};
