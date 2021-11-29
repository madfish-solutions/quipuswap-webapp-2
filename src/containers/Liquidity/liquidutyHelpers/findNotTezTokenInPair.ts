import { WhitelistedToken } from '@utils/types';
import { TEZOS_TOKEN } from '@utils/defaults';

export const findNotTezTokenInPair = (
  tokenA:WhitelistedToken,
  tokenB:WhitelistedToken,
) => {
  if (tokenA.contractAddress === TEZOS_TOKEN.contractAddress) {
    return tokenB;
  }
  return tokenA;
};
