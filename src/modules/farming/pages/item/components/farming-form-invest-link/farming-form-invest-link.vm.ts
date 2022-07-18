import { useMemo } from 'react';

import { AppRootRoutes } from '@app.router';
import { useFarmingItemStore } from '@modules/farming/hooks';
import { LiquidityTabs } from '@modules/liquidity/liquidity-cards/liquidity-tabs';
import { StableswapRoutes } from '@modules/stableswap';
import { StableswapLiquidityFormTabs } from '@modules/stableswap/types';
import { getLiquidityUrl, isNull } from '@shared/helpers';

export const useFarmingFormInvestLinkViewModel = () => {
  const { itemStore } = useFarmingItemStore();
  const { data: farmingItem } = itemStore;

  const { investHref } = useMemo(() => {
    if (isNull(farmingItem)) {
      return {
        investHref: null
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

  return { investHref };
};
