import { FoundDex } from '@quipuswap/sdk';

import { PairInfo } from '@containers/Liquidity/LiquidityForms/add-liquidity-form/pair-info.interface';
import { sortTokensPair } from '@containers/Liquidity/LiquidityForms/helpers/sort-tokens-pair';
import { Nullable, WhitelistedToken } from '@utils/types';

export const loadTezTokenPairInfo = (
  dex: FoundDex,
  tokenA: WhitelistedToken,
  tokenB: WhitelistedToken
): Nullable<PairInfo> => {
  const addresses = sortTokensPair(tokenA, tokenB);

  if (!addresses) {
    return null;
  }

  if (addresses.tokenA.contractAddress === tokenA.contractAddress) {
    return {
      id: null,
      tokenA,
      tokenB,
      tokenAPool: dex.storage.storage.tez_pool,
      tokenBPool: dex.storage.storage.token_pool,
      totalSupply: dex.storage.storage.total_supply
    };
  }

  return {
    id: null,
    tokenA: tokenB,
    tokenB: tokenA,
    tokenAPool: dex.storage.storage.token_pool,
    tokenBPool: dex.storage.storage.tez_pool,
    totalSupply: dex.storage.storage.total_supply
  };
};
