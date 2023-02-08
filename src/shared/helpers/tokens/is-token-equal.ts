import { TokenAddress } from '@shared/types';

export const isTokenEqual = (a: TokenAddress, b: TokenAddress) =>
  a.contractAddress === b.contractAddress && a.fa2TokenId === b.fa2TokenId;
