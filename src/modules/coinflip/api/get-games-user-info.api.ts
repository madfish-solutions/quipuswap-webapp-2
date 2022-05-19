import { BigNumber } from 'bignumber.js';

import { DEFAULT_TOKEN } from '@config/tokens';

import { GameUserInfo } from '../types';

export const getGameUserInfoApi = async (): Promise<GameUserInfo> => {
  const gamesCount = new BigNumber(5);
  const tokensWon = [{ token: DEFAULT_TOKEN, amount: new BigNumber(20) }];

  return { gamesCount, tokensWon };
};
