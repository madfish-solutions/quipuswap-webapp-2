import { SKIP, SWAP } from '@config/constants';
import { Token } from '@shared/types';

import { getTokenStandard } from './get-token-standard';
import { isTokenFa12, isTokenFa2 } from './token-type';

const sortAddresses = (address1: string, address2: string) => (address1 > address2 ? SKIP : SWAP);

export const sortTokens = (tokenA: Token, tokenB: Token) => {
  if ((isTokenFa12(tokenA) && isTokenFa12(tokenB)) || (isTokenFa2(tokenA) && isTokenFa2(tokenB))) {
    return sortAddresses(getTokenStandard(tokenA), getTokenStandard(tokenB));
  }

  return isTokenFa12(tokenA) ? SKIP : SWAP;
};
