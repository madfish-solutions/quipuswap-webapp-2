import { StakingTabs } from '@containers/farming/item/types';
import { useFarmingItemStore } from '@hooks/stores/use-farming-item-store';

export const TabsContent = [
  {
    id: StakingTabs.stake,
    label: 'Stake'
  },
  {
    id: StakingTabs.unstake,
    label: 'Unstake'
  }
];

export const useStakingTabsCardViewModel = () => {
  const farmingItemStore = useFarmingItemStore();

  const changeTabHandle = (tab: StakingTabs) => {
    farmingItemStore.setTab(tab);
  };

  const { itemStore, currentTab } = farmingItemStore;
  const { data: stakeItem } = itemStore;

  const isStakeForm = farmingItemStore.currentTab === StakingTabs.stake;

  return {
    stakeItem,
    currentTab,
    isStakeForm,
    changeTabHandle
  };
};
