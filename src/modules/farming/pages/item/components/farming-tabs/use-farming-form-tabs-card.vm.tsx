import { useEffect } from 'react';

import { useNavigate, useParams } from 'react-router-dom'; //TODO

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

  const { tab: farmingTab } = useParams();

  useEffect(() => {
    if (Object.values(FarmingFormTabs).includes(farmingTab as FarmingFormTabs)) {
      farmingItemStore.setTab(farmingTab as FarmingFormTabs);
    } else {
      farmingItemStore.setTab(FarmingFormTabs.stake);
    }
  }, [farmingItemStore, farmingTab]);

  const { item: farmingItem, currentTab } = farmingItemStore;

  useEffect(() => {
    return () => {
      farmingItemStore.setTab(FarmingFormTabs.stake);
    };
  }, [farmingItemStore]);

  const isStakeForm = farmingItemStore.currentTab === FarmingFormTabs.stake;

  const changeTabHandle = (tab: FarmingFormTabs) => {
    farmingItemStore.setTab(tab);
    const navigateUrl = farmingItemStore.old
      ? `/farming/v1/${farmingItem?.id}/${tab}`
      : `/farming/${farmingItem?.id}/${tab}`;
    navigate(navigateUrl);
  };

  return {
    farmingItem,
    currentTab,
    isStakeForm,
    changeTabHandle
  };
};
