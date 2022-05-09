import { useNavigate } from 'react-router-dom';

import { StableswapFormTabs } from '@modules/stableswap/types';

import { useStableswapItemStore } from '../../../../../hooks';

export const TabsContent = [
  {
    id: StableswapFormTabs.add,
    label: 'Add'
  },
  {
    id: StableswapFormTabs.remove,
    label: 'Remove'
  }
];

export const useStableswapFormTabsCardViewModel = () => {
  const stableswapItemStore = useStableswapItemStore();
  const navigate = useNavigate();

  const { itemStore, currentTab } = stableswapItemStore;
  const { data: stableswapItem } = itemStore;

  const isAddForm = stableswapItemStore.currentTab === StableswapFormTabs.add;

  const changeTabHandle = (tab: StableswapFormTabs) => {
    stableswapItemStore.setTab(tab);
    navigate(`/stableswap/liquidity/${tab}/${stableswapItem?.id}`);
  };

  return {
    stableswapItem,
    currentTab,
    isAddForm,
    changeTabHandle
  };
};
