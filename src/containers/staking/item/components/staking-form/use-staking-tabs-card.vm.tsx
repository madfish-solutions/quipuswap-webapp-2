import { StakingTabs } from '@containers/staking/item/types';
import { useStakingFormStore } from '@hooks/stores/use-staking-form-store';

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
  const stakingFormStore = useStakingFormStore();

  const changeTabHandle = (tab: StakingTabs) => {
    stakingFormStore.setTab(tab);
  };

  const { stakeItem, currentTab } = stakingFormStore;
  const isStakeForm = stakingFormStore.currentTab === StakingTabs.stake;

  return {
    stakeItem,
    currentTab,
    isStakeForm,
    changeTabHandle
  };
};
