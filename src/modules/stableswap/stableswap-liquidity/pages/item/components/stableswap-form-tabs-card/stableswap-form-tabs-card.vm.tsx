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

  const isAddForm = currentTab === StableswapFormTabs.add;

  const changeTabHandle = (tab: StableswapFormTabs) => {
    stableswapItemStore.setTab(tab);
    const url = `/stableswap/liquidity/${tab}/${stableswapItem?.id}`;

    navigate(url);
  };

  return {
    stableswapItem,
    currentTab,
    isAddForm,
    changeTabHandle
  };
};
