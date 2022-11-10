import { useEffect } from 'react';

import { useFarmingListStore, useHarvestAndRollStore } from '@modules/farming/hooks';
import { useGetFarmingList } from '@modules/farming/hooks/loaders/use-get-farming-list';
import { useGetFarmingStats } from '@modules/farming/hooks/loaders/use-get-farming-stats';
import { useReady } from '@providers/use-dapp';
import { useAuthStore } from '@shared/hooks';
import { useTranslation } from '@translation';

import { farmingListCommonDataHelper } from './farming-list-common-data.helper';
import { farmingListDataHelper } from './farming-list-data.helper';

export const useFarmingListPageViewModel = () => {
  const isReady = useReady();
  const { accountPkh } = useAuthStore();
  const farmingListCommonStore = useFarmingListStore();
  const { getFarmingList } = useGetFarmingList();
  const { getFarmingStats } = useGetFarmingStats();
  const { opened } = useHarvestAndRollStore();
  const { list, isLoading } = useFarmingListStore();

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

  const data = list?.map(item => farmingListDataHelper(item, accountPkh));

  const dataCommon = farmingListCommonStore.filteredList?.map(item => farmingListCommonDataHelper(item, accountPkh));

  return {
    isLoading,
    list: data ?? [],
    listCommon: dataCommon ?? [],
    title,
    opened
  };
};
