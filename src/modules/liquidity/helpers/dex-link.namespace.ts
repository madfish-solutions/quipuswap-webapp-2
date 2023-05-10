import { BigNumber } from 'bignumber.js';

import { AppRootRoutes } from '@app.router';
import { StableswapRoutes } from '@modules/stableswap';
import { StableswapLiquidityFormTabs, Version } from '@modules/stableswap/types';
import { getTokenPairSlug } from '@shared/helpers';
import { Token } from '@shared/types';

import { LiquidityRoutes, LiquidityTabs } from '../liquidity-routes.enum';

export namespace DexLink {
  export const getCpmmPoolLink = (tokenPair: [Token, Token]) => {
    const tokenPairSlug = getTokenPairSlug(...tokenPair);

    return `${AppRootRoutes.Liquidity}${LiquidityRoutes.cpmm}/${LiquidityTabs.add}/${tokenPairSlug}`;
  };

  export const getOldLiquidityPoolLink = (tokenPair: [Token, Token]) => {
    const tokenPairSlug = getTokenPairSlug(...tokenPair);

    return `${AppRootRoutes.Liquidity}/${LiquidityTabs.add}/${tokenPairSlug}`;
  };

  export const getStableswapPoolLink = (id: BigNumber, version: Version) => {
    return `${AppRootRoutes.Stableswap}${StableswapRoutes.liquidity}/${
      StableswapLiquidityFormTabs.add
    }/${version}/${id.toFixed()}`;
  };

  export const getLiquidityV3PositionLink = (poolId: BigNumber, positionId: BigNumber) =>
    `${AppRootRoutes.Liquidity}${LiquidityRoutes.v3}/${poolId.toFixed()}/${LiquidityTabs.add}/${positionId.toFixed()}`;

  export const getLiquidityV3PoolLink = (poolId: BigNumber) => {
    return `${AppRootRoutes.Liquidity}${LiquidityRoutes.v3}/${poolId.toFixed()}`;
  };
}
