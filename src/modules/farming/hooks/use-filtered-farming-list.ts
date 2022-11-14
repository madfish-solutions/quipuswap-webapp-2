import { useAuthStore } from '@shared/hooks';

import { farmingListCommonDataHelper } from '../pages/list/farming-list-common-data.helper';
import { useFarmingListStore } from './stores';

export const useFilteredFarmingList = () => {
  const { accountPkh } = useAuthStore();
  const farmingListStore = useFarmingListStore();
  const farmings = farmingListStore.filteredList?.map(item => farmingListCommonDataHelper(item, accountPkh)) ?? [];

  return { farmings };
};
