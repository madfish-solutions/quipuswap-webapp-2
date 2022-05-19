import { BigNumber } from 'bignumber.js';

import { Token } from '@shared/types';

export interface TokenWon {
  token: Token;
  amount: BigNumber;
}

export interface GameUserInfo {
  gamesCount: BigNumber;
  tokensWon: Array<TokenWon>;
}
