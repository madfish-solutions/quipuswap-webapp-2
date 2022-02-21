import { StakingTabs } from '@containers/staking/item/types';
import { useStakingItemStore } from '@hooks/stores/use-staking-item-store';

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
  const stakingItemStore = useStakingItemStore();

  const changeTabHandle = (tab: StakingTabs) => {
    stakingItemStore.setTab(tab);
  };

  const { stakeItem, currentTab } = stakingItemStore;
  const isStakeForm = stakingItemStore.currentTab === StakingTabs.stake;

  return {
    stakeItem,
    currentTab,
    isStakeForm,
    changeTabHandle
  };
};
