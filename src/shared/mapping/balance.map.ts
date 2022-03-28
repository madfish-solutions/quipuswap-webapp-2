import BigNumber from 'bignumber.js';

import { Nullable, Optional, Token } from '../../types/types';
import { fromDecimals } from '../helpers';

export const balanceMap = (balance: Nullable<BigNumber>, token: Optional<Token>) => {
  if (!balance) {
    return null;
  }
  if (!token) {
    return balance;
  }

  return fromDecimals(balance, token);
};
