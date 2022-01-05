import { TEZOS_TOKEN } from '@app.config';
import { WhitelistedToken } from '@utils/types';

export const findNotTezTokenInPair = (tokenA: WhitelistedToken, tokenB: WhitelistedToken) => {
  if (tokenA.contractAddress === TEZOS_TOKEN.contractAddress) {
    return tokenB;
  }

  return tokenA;
};
