import BigNumber from 'bignumber.js';

import { toReal } from '../helpers';
import { Nullable, Optional, Token } from '../types/types';

export const realBalanceMap = (balance: Nullable<BigNumber>, token: Optional<Token>) => {
  if (!balance) {
    return null;
  }
  if (!token) {
    return balance;
  }

  return toReal(balance, token);
};
