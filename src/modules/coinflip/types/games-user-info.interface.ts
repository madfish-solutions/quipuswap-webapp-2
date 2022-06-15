import { BigNumber } from 'bignumber.js';

import { Token } from '@shared/types';

export interface TokenWon {
  token: Token;
  amount: Nullable<BigNumber>;
}

export interface GameUserInfo {
  gamesCount: Nullable<BigNumber>;
  tokensWon: Nullable<Array<TokenWon>>;
}
