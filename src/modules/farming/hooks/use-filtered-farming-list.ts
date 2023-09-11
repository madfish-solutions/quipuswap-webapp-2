import { useAuthStore } from '@shared/hooks';

import { useFarmingFilterStore, useFarmingListStore } from './stores';
import { filterByActiveOnly, filterBySearch, filterByStakedOnly } from '../helpers';
import { sortFarming } from '../pages/list/helpers';
import { mapFarmingItemForView } from '../pages/list/map-farming-item-for.view';

export const useFilteredFarmingList = () => {
  const { accountPkh } = useAuthStore();
  const { activeOnly, stakedOnly, sortField, sortDirection, search, tokenId } = useFarmingFilterStore();
  const farmingListStore = useFarmingListStore();

  const farmings = farmingListStore.farmingItemsWithBalances
    .filter(filterByActiveOnly(activeOnly))
    .filter(filterByStakedOnly(stakedOnly, accountPkh))
    .filter(filterBySearch(search, tokenId))
    .sort(sortFarming(sortField, sortDirection))
    .map(mapFarmingItemForView(accountPkh, farmingListStore.balancesAreLoading));

  return { farmings };
};
