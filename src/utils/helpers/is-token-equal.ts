import { RawToken } from '@interfaces/types';

export const isTokenEqual = (a: RawToken, b: RawToken) =>
  a.contractAddress === b.contractAddress && a.fa2TokenId === b.fa2TokenId;
