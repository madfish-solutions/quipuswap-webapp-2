import { TokenPair } from '../types';
import { isTokenEqual } from './tokens';

export const isEqualTokenPairs = (tp1: TokenPair, tp2: TokenPair): boolean =>
  isTokenEqual(tp1.token1, tp2.token1) &&
  isTokenEqual(tp1.token2, tp2.token2) &&
  tp1.balance === tp2.balance &&
  tp1.frozenBalance === tp2.frozenBalance;
