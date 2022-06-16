import { useCallback, useMemo } from 'react';

import { useNavigate } from 'react-router-dom';

import { AppRootRoutes } from '@app.router';
import { i18n } from '@translation';

import { useStableswapItemStore, useStableFarmItemStore } from '../../hooks';
import { StableswapRoutes, StableswapContentRoutes } from '../../stableswap-routes.enum';
import { StableswapFormTabs } from '../../types';

export const TabsContent = {
  [StableswapRoutes.liquidity]: [
    {
      id: StableswapFormTabs.add,
      label: i18n.t('common|Add')
    },
    {
      id: StableswapFormTabs.remove,
      label: i18n.t('common|Remove')
    }
  ],
  [StableswapRoutes.farming]: [
    {
      id: StableswapFormTabs.stake,
      label: i18n.t('common|Stake')
    },
    {
      id: StableswapFormTabs.unstake,
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
