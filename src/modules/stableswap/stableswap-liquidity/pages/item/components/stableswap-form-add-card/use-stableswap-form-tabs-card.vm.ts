import { useNavigate } from 'react-router-dom';

import { AppRootRoutes } from '@app.router';
import { StableswapRoutes } from '@modules/stableswap';
import { i18n } from '@translation';

import { useStableswapItemStore } from '../../../../../hooks';
import { StableswapFormTabs } from '../../../../../types';

export const TabsContent = [
  {
    id: StableswapFormTabs.add,
    label: i18n.t('common|Add')
  },
  {
    id: StableswapFormTabs.remove,
    label: i18n.t('common|Remove')
  }
];

export const useStableswapFormTabsCardViewModel = () => {
  const stableswapItemStore = useStableswapItemStore();
  const navigate = useNavigate();

  const { itemStore } = stableswapItemStore;
  const { data: stableswapItem } = itemStore;

  const changeTabHandle = (tab: StableswapFormTabs) => {
    const url = `${AppRootRoutes.Stableswap}${StableswapRoutes.liquidity}/${tab}/${stableswapItem?.id}`;

    navigate(url);
  };

  return {
    stableswapItem,
    changeTabHandle
  };
};
