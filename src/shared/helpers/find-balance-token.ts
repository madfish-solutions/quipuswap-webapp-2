import { BalanceToken } from '@shared/hooks';
import { Token } from '@shared/types';

import { isTokenEqual } from './tokens';

export const findBalanceToken = (balances: Array<BalanceToken>, token: Token) =>
  balances.find(value => isTokenEqual(value.token, token));
