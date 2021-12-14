import { TEZOS_TOKEN } from '@utils/defaults';
import { WhitelistedToken } from '@utils/types';

export const findNotTezTokenInPair = (tokenA: WhitelistedToken, tokenB: WhitelistedToken) => {
  if (tokenA.contractAddress === TEZOS_TOKEN.contractAddress) {
    return tokenB;
  }
  return tokenA;
};
