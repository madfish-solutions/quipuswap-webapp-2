import { useCallback } from 'react';

import { useFarmingYouvesItemStore } from '@modules/farming/hooks';

import { YouvesFormTabs } from '../../types';

export const TabsContent = [
  {
    id: YouvesFormTabs.stake,
    label: 'Stake'
  },
  {
    id: YouvesFormTabs.unstake,
    label: 'Unstake'
  }
];

export const useFarmingFormTabsCardViewModel = () => {
  const farmingYouvesItemStore = useFarmingYouvesItemStore();
  const currentTab = farmingYouvesItemStore.currentTab;
  const isStakeForm = currentTab === YouvesFormTabs.stake;

  const setCurrentTab = useCallback(
    (tabName: YouvesFormTabs) => farmingYouvesItemStore.setTab(tabName),
    [farmingYouvesItemStore]
  );

  return {
    currentTab,
    setCurrentTab,
    isStakeForm
  };
};
