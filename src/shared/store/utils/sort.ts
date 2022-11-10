import { BigNumber } from 'bignumber.js';

import { SKIP, SWAP } from '@config/constants';

import { ManagedToken, Nullable, Optional, Token } from '../../types';
import { TokenBalance } from '../tokens-balances.store';

export const sortByFavorite = (a: ManagedToken) => (a.isFavorite ? SKIP : SWAP);

export const sortByName = (a: Token, b: Token) => (a.metadata.name > b.metadata.name ? SWAP : SKIP);

const sortByBigNumber = (a: BigNumber, b: BigNumber) => a.toNumber() - b.toNumber();
// Check is possible to sort by this optional
const isSortableByOptional = <T>(a: Optional<T>, b: Optional<T>) => !(a && b);
const sortByOptional = <T>(a: Optional<T>, b: Optional<T>) => ((!a && !b) || (a && !b) ? SKIP : SWAP);

export const sortByBalance = (a: Nullable<TokenBalance>, b: Nullable<TokenBalance>) => {
  if (isSortableByOptional(a, b)) {
    return sortByOptional(a, b);
  }

  if (isSortableByOptional(a?.dollarEquivalent, b?.dollarEquivalent)) {
    return sortByOptional(a?.dollarEquivalent, b?.dollarEquivalent);
  } else if (a?.dollarEquivalent && b?.dollarEquivalent) {
    return sortByBigNumber(a.dollarEquivalent, b.dollarEquivalent);
  }

  if (isSortableByOptional(a?.balance, b?.balance)) {
    return sortByOptional(a?.balance, b?.balance);
  } else if (a?.balance && b?.balance) {
    return sortByBigNumber(a.balance, b.balance);
  }

  return SKIP;
};
