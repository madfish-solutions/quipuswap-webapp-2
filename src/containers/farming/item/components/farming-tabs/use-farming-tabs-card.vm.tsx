import { FarmingTabs } from '@containers/farming/item/types';
import { useFarmingItemStore } from '@hooks/stores/use-farming-item-store';

export const TabsContent = [
  {
    id: FarmingTabs.stake,
    label: 'Stake'
  },
  {
    id: FarmingTabs.unstake,
    label: 'Unstake'
  }
];

export const useFarmingTabsCardViewModel = () => {
  const farmingItemStore = useFarmingItemStore();

  const changeTabHandle = (tab: FarmingTabs) => {
    farmingItemStore.setTab(tab);
  };

  const { itemStore, currentTab } = farmingItemStore;
  const { data: farmingItem } = itemStore;

  const isStakeForm = farmingItemStore.currentTab === FarmingTabs.stake;

  return {
    farmingItem,
    currentTab,
    isStakeForm,
    changeTabHandle
  };
};
