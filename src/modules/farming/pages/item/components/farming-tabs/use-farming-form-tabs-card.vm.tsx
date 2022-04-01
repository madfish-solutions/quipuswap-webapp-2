import { useFarmingItemStore } from '@modules/farming/hooks';

import { FarmingFormTabs } from '../../types'; //TODO

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

  const changeTabHandle = (tab: FarmingFormTabs) => {
    farmingItemStore!.setTab(tab);
  };

  const { itemStore, currentTab } = farmingItemStore!;
  const { data: farmingItem } = itemStore;

  const isStakeForm = farmingItemStore!.currentTab === FarmingFormTabs.stake;

  return {
    farmingItem,
    currentTab,
    isStakeForm,
    changeTabHandle
  };
};
