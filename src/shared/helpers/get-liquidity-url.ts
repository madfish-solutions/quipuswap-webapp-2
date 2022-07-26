import { AppRootRoutes } from '@app.router';
import { getTokenPairSlug } from '@shared/helpers';
import { Nullable, Token } from '@shared/types';

export const getLiquidityUrl = (tabId: Nullable<string>, tokenA: Nullable<Token>, tokenB: Nullable<Token>) => {
  if (!tabId) {
    return AppRootRoutes.Liquidity;
  }

  if (!tokenA || !tokenB) {
    return `${AppRootRoutes.Liquidity}/${tabId}`;
  }

  return `${AppRootRoutes.Liquidity}/${tabId}/${getTokenPairSlug(tokenA, tokenB)}`;
};

export const getFullLiquidityUrl = (tabId: string, tokenA: string, tokenB: string) =>
  `${AppRootRoutes.Liquidity}/${tabId}/${tokenA}-${tokenB}`;
