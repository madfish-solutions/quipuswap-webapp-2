import { useNavigate } from 'react-router-dom';

import { AppRootRoutes } from '@app.router';
import { i18n } from '@translation';

import { useStableswapItemFormStore, useStableswapItemStore } from '../../../../../hooks';
import { StableswapRoutes } from '../../../../../stableswap.page';
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
  const stableswapItemFormStore = useStableswapItemFormStore();
  const navigate = useNavigate();

  const { itemStore } = stableswapItemStore;
  const { data: stableswapItem } = itemStore;

  const changeTabHandle = (tab: StableswapFormTabs) => {
    stableswapItemFormStore.clearStore();
    const url = `${AppRootRoutes.Stableswap}${StableswapRoutes.liquidity}${tab}/${stableswapItem?.id}`;

    navigate(url);
  };

  return {
    stableswapItem,
    changeTabHandle
  };
};
