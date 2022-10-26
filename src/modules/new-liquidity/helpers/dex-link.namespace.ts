import { BigNumber } from 'bignumber.js';

import { AppRootRoutes } from '@app.router';
import { LiquidityTabs } from '@modules/liquidity';
import { StableswapRoutes } from '@modules/stableswap';
import { StableswapLiquidityFormTabs } from '@modules/stableswap/types';
import { getTokenPairSlug } from '@shared/helpers';
import { Token } from '@shared/types';

import { NewLiquidityRoutes } from '../new-liquidity-routes.enum';
import { NewLiquidityFormTabs } from '../types';

export namespace DexLink {
  export const getCpmmPoolLink = (tokenPair: [Token, Token]) => {
    const tokenPairSlug = getTokenPairSlug(...tokenPair);

    return `${AppRootRoutes.NewLiquidity}${NewLiquidityRoutes.cpmm}/${NewLiquidityFormTabs.add}/${tokenPairSlug}`;
  };

  export const getOldLiquidityPoolLink = (tokenPair: [Token, Token]) => {
    const tokenPairSlug = getTokenPairSlug(...tokenPair);

    return `${AppRootRoutes.Liquidity}/${LiquidityTabs.Add}/${tokenPairSlug}`;
  };

  export const getStableswapPoolLink = (id: BigNumber) => {
    return `${AppRootRoutes.Stableswap}/${StableswapRoutes.liquidity}/${
      StableswapLiquidityFormTabs.add
    }/${id.toFixed()}`;
  };
}
