import { SKIP, SWAP } from '@config/constants';
import { isTokenFa12, isTokenFa2, sortAddresses } from '@shared/helpers';
import { Token } from '@shared/types';

export const sortTokens = (tokenA: Token, tokenB: Token) => {
  if (isTokenFa12(tokenA) && isTokenFa12(tokenB)) {
    return sortAddresses(tokenA.contractAddress, tokenB.contractAddress);
  }

  if (isTokenFa2(tokenA) && isTokenFa2(tokenB)) {
    if (tokenA.fa2TokenId > tokenB.fa2TokenId) {
      return SKIP;
    }

    if (tokenA.fa2TokenId < tokenB.fa2TokenId) {
      return SWAP;
    }

    return sortAddresses(tokenA.contractAddress, tokenB.contractAddress);
  }

  if (isTokenFa2(tokenA) && isTokenFa12(tokenB)) {
    return SKIP;
  }

  return SWAP;
};
