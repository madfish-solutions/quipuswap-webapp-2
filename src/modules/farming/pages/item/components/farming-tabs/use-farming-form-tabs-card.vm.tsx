import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom'; //TODO

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

  const { itemStore, currentTab } = farmingItemStore;
  const { data: farmingItem } = itemStore;

  useEffect(() => {
    return () => {
      farmingItemStore.setTab(FarmingFormTabs.stake);
    };
  }, [farmingItemStore]);

  const isStakeForm = farmingItemStore.currentTab === FarmingFormTabs.stake;

  const changeTabHandle = (tab: FarmingFormTabs) => {
    farmingItemStore.setTab(tab);
    navigate(`/farming/${farmingItem?.id}/${tab}`);
  };

  return {
    farmingItem,
    currentTab,
    isStakeForm,
    changeTabHandle
  };
};
