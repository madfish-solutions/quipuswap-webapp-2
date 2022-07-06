import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { isNull } from '@shared/helpers';

import { UserLastGameRaw } from '../interfaces';
import { getCoinflipStorageApi } from './get-coinflip-storage.api';
import { CoinflipStorage } from './types';

export const getUserLastGameInfo = async (tezos: Nullable<TezosToolkit>, gameId: Nullable<BigNumber>) => {
  if (isNull(tezos) || isNull(gameId)) {
    return null;
  }

  const coinflipStorage = await getCoinflipStorageApi<CoinflipStorage>(tezos);

  if (isNull(coinflipStorage)) {
    return null;
  }

  const userLastGameInfo = await coinflipStorage.games.get<UserLastGameRaw>(gameId);

  return userLastGameInfo ?? null;
};
