import { QUIPU_TOKEN, TEZOS_TOKEN } from '@config/tokens';

import { PoolType } from './interfaces';

export const POOLS_DATA = [
  {
    id: 1,
    type: PoolType.DEX_TWO,
    itemUrl: '/',
    tvl: '10000000',
    tvlInUsd: 1000,
    apr: '1000000',
    liquidityProvidersFee: 1,
    tokensInfo: [TEZOS_TOKEN, QUIPU_TOKEN],
    visibleIcon: true,
    newLiquidityLablesData: { MEDAL: true, DOLLAR: true, CASE: true },
    isNewLiquidity: true
  },
  {
    id: 2,
    type: PoolType.DEX_TWO,
    itemUrl: '/',
    tvl: '1000000',
    tvlInUsd: 1000,
    apr: '1000000',
    liquidityProvidersFee: 0.1,
    tokensInfo: [TEZOS_TOKEN, QUIPU_TOKEN],
    visibleIcon: true,
    newLiquidityLablesData: { MEDAL: true, DOLLAR: true, CASE: true },
    isNewLiquidity: true
  },
  {
    id: 3,
    type: PoolType.TEZ_TOKEN,
    itemUrl: '/',
    tvl: '100000',
    tvlInUsd: 1000,
    apr: '100000',
    liquidityProvidersFee: 1,
    tokensInfo: [TEZOS_TOKEN, QUIPU_TOKEN],
    visibleIcon: true,
    newLiquidityLablesData: { CASE: true, DOLLAR: true },
    isNewLiquidity: true
  },
  {
    id: 4,
    type: PoolType.DEX_TWO,
    itemUrl: '/',
    tvl: '10000',
    tvlInUsd: 1000,
    apr: '10000',
    liquidityProvidersFee: 1,
    tokensInfo: [TEZOS_TOKEN, QUIPU_TOKEN],
    visibleIcon: true,
    newLiquidityLablesData: { CASE: true, DOLLAR: true },
    isNewLiquidity: true
  },
  {
    id: 5,
    type: PoolType.STABLESWAP,
    itemUrl: '/',
    tvl: '1000',
    tvlInUsd: 1000,
    apr: '1000',
    liquidityProvidersFee: 0.5,
    tokensInfo: [TEZOS_TOKEN, QUIPU_TOKEN],
    newLiquidityLablesData: { DOLLAR: true },
    isNewLiquidity: true
  },
  {
    id: 6,
    type: PoolType.TOKEN_TOKEN,
    itemUrl: '/',
    tvl: '1000',
    tvlInUsd: 1000,
    apr: '1000',
    liquidityProvidersFee: 0.4,
    tokensInfo: [TEZOS_TOKEN, QUIPU_TOKEN],
    newLiquidityLablesData: { DOLLAR: true },
    isNewLiquidity: true
  },
  {
    id: 7,
    type: PoolType.DEX_TWO,
    itemUrl: '/',
    tvl: '1000',
    tvlInUsd: 1000,
    apr: '1000',
    liquidityProvidersFee: 0.2,
    tokensInfo: [TEZOS_TOKEN, QUIPU_TOKEN],
    newLiquidityLablesData: { MEDAL: true },
    isNewLiquidity: true
  },
  {
    id: 8,
    type: PoolType.DEX_TWO,
    itemUrl: '/',
    tvl: '1',
    tvlInUsd: 1000,
    apr: '1',
    liquidityProvidersFee: 0.5,
    tokensInfo: [TEZOS_TOKEN, QUIPU_TOKEN],
    newLiquidityLablesData: { CASE: true },
    isNewLiquidity: true
  }
];
