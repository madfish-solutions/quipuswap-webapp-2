import { RawToken } from '@interfaces/types';

export const tokenDataToToken = (token: RawToken): RawToken =>
  ({
    contractAddress: token.contractAddress,
    fa2TokenId: token.fa2TokenId ?? undefined
  } as RawToken);
