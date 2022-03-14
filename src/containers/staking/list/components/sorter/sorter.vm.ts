import { useStakingListStore } from '@hooks/stores/use-staking-list-store';

import { SortValue } from './sorter';

export const useSorterViewModel = () => {
  const stakingListStore = useStakingListStore();

  const onSorterChange = (value: unknown) => {
    return stakingListStore.onSorterChange(value as SortValue);
  };

  return {
    onSorterChange
  };
};
