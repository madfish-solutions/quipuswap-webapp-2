import { useNavigate } from 'react-router-dom';

import { AppRootRoutes } from '@app.router';
import { i18n } from '@translation';

import { useStableswapItemStore } from '../../../../../hooks';
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
  const navigate = useNavigate();

  const { itemStore, currentTab } = stableswapItemStore;
  const { data: stableswapItem } = itemStore;

  const isAddForm = currentTab === StableswapFormTabs.add;

  const changeTabHandle = (tab: StableswapFormTabs) => {
    stableswapItemStore.setTab(tab);
    const url = `${AppRootRoutes.Stableswap}${StableswapRoutes.liquidity}/${tab}/${stableswapItem?.id}`;

    navigate(url);
  };

  return {
    stableswapItem,
    currentTab,
    isAddForm,
    changeTabHandle
  };
};
