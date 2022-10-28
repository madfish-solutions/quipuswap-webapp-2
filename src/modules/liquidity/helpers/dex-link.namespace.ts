import { BigNumber } from 'bignumber.js';

import { AppRootRoutes } from '@app.router';
import { LiquidityTabs } from '@modules/liquidity/pages/liquidity';
import { StableswapRoutes } from '@modules/stableswap';
import { StableswapLiquidityFormTabs } from '@modules/stableswap/types';
import { getTokenPairSlug } from '@shared/helpers';
import { Token } from '@shared/types';

import { LiquidityRoutes, NewLiquidityFormTabs } from '../liquidity-routes.enum';

export namespace DexLink {
  export const getCpmmPoolLink = (tokenPair: [Token, Token]) => {
    const tokenPairSlug = getTokenPairSlug(...tokenPair);

    return `${AppRootRoutes.Liquidity}${LiquidityRoutes.cpmm}/${NewLiquidityFormTabs.add}/${tokenPairSlug}`;
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
