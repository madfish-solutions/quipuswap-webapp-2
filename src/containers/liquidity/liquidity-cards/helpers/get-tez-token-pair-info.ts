import { FoundDex } from '@quipuswap/sdk';

import { TEZOS_TOKEN } from '@app.config';
import { Nullable, RawToken } from '@interfaces/types';

import { PairInfo } from '../add-liquidity-form/pair-info.interface';

export const getTezTokenPairInfo = (dex: FoundDex, token1: RawToken, token2: RawToken): Nullable<PairInfo> => {
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
