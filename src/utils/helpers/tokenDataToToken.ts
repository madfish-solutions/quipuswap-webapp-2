import { Token } from '@utils/types';

export const tokenDataToToken = (token: Token): Token =>
  ({
    contractAddress: token.contractAddress,
    fa2TokenId: token.fa2TokenId ?? undefined
  } as Token);
