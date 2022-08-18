import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { isNull } from '@shared/helpers';

import { UserLastGameRaw } from '../interfaces';
import { getCoinflipStorageApi } from './get-coinflip-storage.api';
import { CoinflipStorage } from './types';

export const DEFAULT_USER_LAST_GAME = {
  bidSize: null,
  betCoinSide: null,
  status: null
};

export const getUserLastGameInfo = async (tezos: Nullable<TezosToolkit>, gameId: Nullable<BigNumber>) => {
  if (isNull(tezos) || isNull(gameId)) {
    return DEFAULT_USER_LAST_GAME;
  }

  const coinflipStorage = await getCoinflipStorageApi<CoinflipStorage>(tezos);

  if (isNull(coinflipStorage)) {
    return DEFAULT_USER_LAST_GAME;
  }

  const userLastGameInfo = await coinflipStorage.games.get<UserLastGameRaw>(gameId);

  if (!userLastGameInfo) {
    return DEFAULT_USER_LAST_GAME;
  }

  const { bid_size: bidSize, bet_coin_side: betCoinSide, status } = userLastGameInfo;

  return {
    bidSize,
    betCoinSide,
    status
  };
};
