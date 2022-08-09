import { useMemo } from 'react';

import { AppRootRoutes } from '@app.router';
import { TEZOS_TOKEN } from '@config/tokens';
import { useFarmingItemStore } from '@modules/farming/hooks';
import { LiquidityTabs } from '@modules/liquidity/liquidity-cards/liquidity-tabs';
import { StableswapRoutes } from '@modules/stableswap';
import { StableswapLiquidityFormTabs } from '@modules/stableswap/types';
import { getFirstElement, getLiquidityUrl, getTokenPairSlug, isNull, isSingleElement } from '@shared/helpers';

export const useFarmingFormInvestLinkViewModel = () => {
  const { item: farmingItem } = useFarmingItemStore();

  const { investHref, tradeHref } = useMemo(() => {
    if (isNull(farmingItem)) {
      return {
        investHref: null,
        tradeHref: null
      };
    }
    if (isSingleElement(farmingItem.tokens)) {
      return {
        tradeHref: `${AppRootRoutes.Swap}/${getTokenPairSlug(TEZOS_TOKEN, getFirstElement(farmingItem.tokens))}`
      };
    }

    if (farmingItem.stableswapItemId) {
      return {
        investHref: `${AppRootRoutes.Stableswap}${StableswapRoutes.liquidity}/${StableswapLiquidityFormTabs.add}/${farmingItem.stableswapItemId}`
      };
    }
    const [tokenA, tokenB] = farmingItem.tokens;

    return {
      investHref: getLiquidityUrl(LiquidityTabs.Add, tokenA, tokenB)
    };
  }, [farmingItem]);

  return { investHref, tradeHref };
};
