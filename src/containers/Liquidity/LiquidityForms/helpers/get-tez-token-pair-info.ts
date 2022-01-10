import { FoundDex } from '@quipuswap/sdk';

import { Nullable, WhitelistedToken } from '@utils/types';

import { PairInfo } from '../add-liquidity-form';
import { sortTokensPair } from './sort-tokens-pair';

export const getTezTokenPairInfo = (
  dex: FoundDex,
  token1: WhitelistedToken,
  token2: WhitelistedToken
): Nullable<PairInfo> => {
  const addresses = sortTokensPair(token1, token2);

  if (!addresses) {
    return null;
  }

  const isTokenA1 = addresses.tokenA.contractAddress === token1.contractAddress;
  const tokenA = isTokenA1 ? token1 : token2;
  const tokenB = isTokenA1 ? token2 : token1;
  const tokenAPool = isTokenA1 ? 'tez_pool' : 'token_pool';
  const tokenBPool = isTokenA1 ? 'token_pool' : 'tez_pool';

  return {
    id: null,
    tokenA,
    tokenB,
    tokenAPool: dex.storage.storage[tokenAPool],
    tokenBPool: dex.storage.storage[tokenBPool],
    totalSupply: dex.storage.storage.total_supply
  };
};
