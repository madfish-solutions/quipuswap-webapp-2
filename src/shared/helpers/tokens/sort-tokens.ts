import { SKIP, SWAP } from '@config/constants';
import { Token } from '@shared/types';

import { getTokenSlug } from './token-slug';
import { isTokenFa12, isTokenFa2 } from './token-type';

export const sortAddresses = (address1: string, address2: string) => (address1 > address2 ? SWAP : SKIP);

export const sortTokens = (tokenA: Token, tokenB: Token) => {
  const isFa12Tokens = isTokenFa12(tokenA) && isTokenFa12(tokenB);
  const isFa2Tokens = isTokenFa2(tokenA) && isTokenFa2(tokenB);
  const isTheSameStandard = isFa12Tokens || isFa2Tokens;
  if (isTheSameStandard) {
    return sortAddresses(getTokenSlug(tokenA), getTokenSlug(tokenB));
  }

  return isTokenFa12(tokenA) ? SKIP : SWAP;
};
