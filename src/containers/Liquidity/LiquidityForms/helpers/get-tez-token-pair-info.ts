import { FoundDex } from '@quipuswap/sdk';

import { PairInfo } from '@containers/Liquidity/LiquidityForms/add-liquidity-form/pair-info.interface';
import { TEZOS_TOKEN } from '@utils/defaults';
import { Nullable, WhitelistedToken } from '@utils/types';

export const getTezTokenPairInfo = (
  dex: FoundDex,
  token1: WhitelistedToken,
  token2: WhitelistedToken
): Nullable<PairInfo> => {
  const isToken1Tezos = TEZOS_TOKEN.contractAddress === token1.contractAddress;
  const tokenA = isToken1Tezos ? token1 : token2;
  const tokenB = isToken1Tezos ? token2 : token1;

  return {
    id: null,
    tokenA,
    tokenB,
    tokenAPool: dex.storage.storage.tez_pool,
    tokenBPool: dex.storage.storage.token_pool,
    totalSupply: dex.storage.storage.total_supply
  };
};
