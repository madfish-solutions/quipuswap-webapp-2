import { useTranslation } from 'next-i18next';

import { useDoHarvestAll } from '@containers/staking/hooks/use-do-harvest-all';
import { useGetStakingList } from '@containers/staking/hooks/use-get-staking-list';
import { useGetStakingStats } from '@containers/staking/hooks/use-get-staking-stats';
import { useStakingListStore } from '@hooks/stores/use-staking-list-store';

export const useStakingRewardsListViewModel = () => {
  const { t } = useTranslation(['stake']);

  const stakingListStore = useStakingListStore();
  const { delayedGetStakingList } = useGetStakingList();
  const { delayedGetStakingStats } = useGetStakingStats();
  const { doHarvestAll } = useDoHarvestAll();

  const handleHarvestAll = async () => {
    await doHarvestAll(stakingListStore.listStore.data);

    await Promise.all([delayedGetStakingList(), delayedGetStakingStats()]);
  };

  return {
    handleHarvestAll,
    translation: {
      harvestAllTranslation: t('stake|harvestAll'),
      rewardsTooltipTranslation: t('stake|rewardsTooltip')
    }
  };
};
