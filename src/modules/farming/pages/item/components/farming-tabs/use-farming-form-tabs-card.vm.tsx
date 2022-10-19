import { useEffect } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { isValidFamingTab } from '@modules/farming/helpers/is-valid-farming-tab';
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
    const activeTab = isValidFamingTab(farmingTab) ? farmingTab : FarmingFormTabs.stake;

    farmingItemStore.setTab(activeTab);
  }, [farmingItemStore, farmingTab]);

  const { item: farmingItem, currentTab } = farmingItemStore;

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
