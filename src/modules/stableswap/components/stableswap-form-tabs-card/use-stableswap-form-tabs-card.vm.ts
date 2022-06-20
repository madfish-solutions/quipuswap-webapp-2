import { useCallback, useMemo } from 'react';

import { useNavigate } from 'react-router-dom';

import { AppRootRoutes } from '@app.router';
import { i18n } from '@translation';

import { useStableswapItemStore, useStableFarmItemStore } from '../../hooks';
import { StableswapRoutes, StableswapContentRoutes } from '../../stableswap-routes.enum';
import { StableswapFormTabs, StableswapLiquidityFormTabs, StableFarmFormTabs } from '../../types';

export const TabsContent = {
  [StableswapRoutes.liquidity]: [
    {
      id: StableswapLiquidityFormTabs.add,
      label: i18n.t('common|Add')
    },
    {
      id: StableswapLiquidityFormTabs.remove,
      label: i18n.t('common|Remove')
    }
  ],
  [StableswapRoutes.farming]: [
    {
      id: StableFarmFormTabs.stake,
      label: i18n.t('common|Stake')
    },
    {
      id: StableFarmFormTabs.unstake,
      label: i18n.t('common|Unstake')
    }
  ]
};

interface Params {
  subpath: StableswapContentRoutes;
}

export const useStableswapFormTabsCardViewModel = ({ subpath }: Params) => {
  const navigate = useNavigate();
  const stableswapItemStore = useStableswapItemStore();
  const stableFarmItemStore = useStableFarmItemStore();

  const item = useMemo(
    () => (subpath === StableswapRoutes.liquidity ? stableswapItemStore?.item?.id : stableFarmItemStore?.item?.id),
    [stableFarmItemStore?.item?.id, stableswapItemStore?.item?.id, subpath]
  );

  const changeTabHandle = useCallback(
    (tab: StableswapFormTabs) => {
      const url = `${AppRootRoutes.Stableswap}${subpath}/${tab}/${item?.toFixed()}`;

      navigate(url);
    },
    [item, navigate, subpath]
  );

  return {
    isLoading: !Boolean(stableswapItemStore?.item) && !Boolean(stableFarmItemStore?.item),
    changeTabHandle
  };
};
