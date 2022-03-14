import { useAuthStore } from '@hooks/stores/use-auth-store';
import { useStakingFilterStore } from '@hooks/stores/use-staking-filter-store';
import { isNull } from '@utils/helpers';

import { SortValue, SortType } from './sorter.types';

const sortValues = [
  { label: 'APR', value: SortType.APR, up: true },
  { label: 'APR', value: SortType.APR, up: false },
  { label: 'APY', value: SortType.APY, up: true },
  { label: 'APY', value: SortType.APY, up: false },
  { label: 'TVL', value: SortType.TVL, up: true },
  { label: 'TVL', value: SortType.TVL, up: false }
];

const sortUserValues = [
  { label: 'Balance', value: SortType.BALANCE, up: true },
  { label: 'Balance', value: SortType.BALANCE, up: false },
  { label: 'Deposit', value: SortType.DEPOSIT, up: true },
  { label: 'Deposit', value: SortType.DEPOSIT, up: false },
  { label: 'Earned', value: SortType.EARNED, up: true },
  { label: 'Earned', value: SortType.EARNED, up: false }
];

export const useSorterViewModel = () => {
  const stakingFilterStore = useStakingFilterStore();
  const { accountPkh } = useAuthStore();

  const onSorterChange = (value: unknown) => {
    return stakingFilterStore.onSorterChange(value as SortValue);
  };

  const sortingValues = isNull(accountPkh) ? sortValues : sortValues.concat(sortUserValues);

  return {
    sortingValues,
    onSorterChange
  };
};
