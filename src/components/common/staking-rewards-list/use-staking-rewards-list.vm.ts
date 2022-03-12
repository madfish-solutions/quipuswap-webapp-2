import { useTranslation } from 'next-i18next';

import { useDoHarvestAll } from '@containers/staking/hooks/use-do-harvest-all';
import { useGetStakingList } from '@containers/staking/hooks/use-get-staking-list';
import { useStakingListStore } from '@hooks/stores/use-staking-list-store';

export const useStakingRewardsListViewModel = () => {
  const { t } = useTranslation(['stake']);

  const stakingListStore = useStakingListStore();
  const { delayedGetStakingList } = useGetStakingList();
  const { doHarvestAll } = useDoHarvestAll();

  const handleHarvestAll = async () => {
    await doHarvestAll(stakingListStore.listStore.data);

    await delayedGetStakingList();
  };

  return {
    handleHarvestAll,
    translation: {
      harvestAllTranslation: t('stake|harvestAll'),
      rewardsTooltipTranslation: t('stake|rewardsTooltip')
    }
  };
};
