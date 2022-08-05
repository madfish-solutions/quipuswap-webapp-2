import { TokenId } from '@shared/types';

export const isTokenEqual = (a: TokenId, b: TokenId) =>
  a.contractAddress === b.contractAddress && a.fa2TokenId === b.fa2TokenId;
