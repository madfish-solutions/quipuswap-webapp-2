import BigNumber from 'bignumber.js';

import { fromDecimals } from '../helpers';
import { Nullable, Optional, Token } from '../types';

export const balanceMap = (balance: Nullable<BigNumber>, token: Optional<Token>) => {
  if (!balance) {
    return null;
  }
  if (!token) {
    return balance;
  }

  return fromDecimals(balance, token);
};
