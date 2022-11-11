import { BigNumber } from 'bignumber.js';

import { Nullable, Token } from '@shared/types';

export interface TokenWon {
  token: Token;
  amount: Nullable<BigNumber>;
}
