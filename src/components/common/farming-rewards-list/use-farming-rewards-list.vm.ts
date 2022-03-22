import { useTranslation } from 'next-i18next';

import { useDoHarvestAll } from '@containers/farming/hooks/use-do-harvest-all';
import { useGetStakingList } from '@containers/farming/hooks/use-get-staking-list';
import { useGetStakingStats } from '@containers/farming/hooks/use-get-staking-stats';
import { useStakingListStore } from '@hooks/stores/use-staking-list-store';

export const useFarmingRewardsListViewModel = () => {
  const { t } = useTranslation(['farm']);

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
      harvestAllTranslation: t('farm|harvestAll'),
      rewardsTooltipTranslation: t('farm|rewardsTooltip')
    }
  };
};
