import { Token } from 'types/types';

export const isTokenEqual = (a: Token, b: Token) =>
  a.contractAddress === b.contractAddress && a.fa2TokenId === b.fa2TokenId;
