import { useNavigate, useParams } from 'react-router-dom';

import { useFarmingItemStore } from '@modules/farming/hooks';

import { FarmingFormTabs } from '../../types';

export const TabsContent = [
  {
    id: FarmingFormTabs.stake,
    label: 'Stake'
  },
  {
    id: FarmingFormTabs.unstake,
    label: 'Unstake'
  }
];

export const useFarmingFormTabsCardViewModel = () => {
  const farmingItemStore = useFarmingItemStore();
  const navigate = useNavigate();
  const farmId = useParams().farmId;

  const { itemStore, currentTab } = farmingItemStore;
  const { data: farmingItem } = itemStore;

  const isStakeForm = farmingItemStore.currentTab === FarmingFormTabs.stake;

  const changeTabHandle = (tab: FarmingFormTabs) => {
    farmingItemStore.setTab(tab);
    navigate(`/farming/${tab}/${farmId}`);
  };

  return {
    farmingItem,
    currentTab,
    isStakeForm,
    changeTabHandle
  };
};
