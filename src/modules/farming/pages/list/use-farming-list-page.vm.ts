import { useEffect } from 'react';

import { useFarmingListStore, useFilteredFarmingList, useHarvestAndRollStore } from '@modules/farming/hooks';
import { useGetFarmingList } from '@modules/farming/hooks/loaders/use-get-farming-list';
import { useGetFarmingStats } from '@modules/farming/hooks/loaders/use-get-farming-stats';
import { useReady } from '@providers/use-dapp';
import { useTranslation } from '@translation';

export const useFarmingListPageViewModel = () => {
  const isReady = useReady();
  const { getFarmingList } = useGetFarmingList();
  const { getFarmingStats } = useGetFarmingStats();
  const { opened } = useHarvestAndRollStore();
  const { isLoading } = useFarmingListStore();
  const { farmings } = useFilteredFarmingList();

  const { t } = useTranslation();
  const title = t('common|Farming');

  /*
    Load data
  */
  useEffect(() => {
    if (isReady) {
      void getFarmingList();
      void getFarmingStats();
    }
  }, [getFarmingList, getFarmingStats, isReady]);

  return {
    isLoading,
    farmings,
    title,
    opened
  };
};
