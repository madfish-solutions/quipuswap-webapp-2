import { Token } from '@shared/types';

import { isExist } from './type-checks';

export const areFa2TokensEqual = (a: Token, b: Token) =>
  a.contractAddress === b.contractAddress && a.fa2TokenId === b.fa2TokenId;

export const areFa12TokensEqual = (a: Token, b: Token) => a.contractAddress === b.contractAddress;

export const areTokensEqual = (a: Token, b: Token) => {
  if (isExist(a.fa2TokenId) && isExist(b.fa2TokenId)) {
    return areFa2TokensEqual(a, b);
  }

  return areFa12TokensEqual(a, b);
};
