import { useCallback } from 'react';

import { useNavigate } from 'react-router-dom';

import { AppRootRoutes } from '@app.router';
import { i18n } from '@translation';

// import { useStableswapItemStore } from '../../hooks';
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
  // const stableswapItemStore = useStableswapItemStore();

  // const { itemStore } = stableswapItemStore;
  // const { data: stableswapItem } = itemStore;
  const stableswapItem = { id: 0 };

  const changeTabHandle = useCallback(
    (tab: StableswapFormTabs) => {
      const url = `${AppRootRoutes.Stableswap}${subpath}/${tab}/${stableswapItem?.id}`;

      navigate(url);
    },
    [navigate, stableswapItem?.id, subpath]
  );

  return {
    stableswapItem,
    changeTabHandle
  };
};
