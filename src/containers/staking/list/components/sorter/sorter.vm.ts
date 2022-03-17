import { useTranslation } from 'next-i18next';

import { useAuthStore } from '@hooks/stores/use-auth-store';
import { useStakingFilterStore } from '@hooks/stores/use-staking-filter-store';
import { isNull } from '@utils/helpers';

import { SortDirection, SortFieldItem, SortField } from './sorter.types';

export const useSorterViewModel = () => {
  const { t } = useTranslation(['stake', 'common']);
  const stakingFilterStore = useStakingFilterStore();
  const { sortField, sortDirection } = stakingFilterStore;
  const { accountPkh } = useAuthStore();

  const handleSortFieldChange = (value: unknown) => {
    const item = value as SortFieldItem;

    return stakingFilterStore.onSortFieldChange(item.field);
  };

  const handleSortDirectionToggle = () => {
    return stakingFilterStore.onSortDirectionToggle();
  };

  const sortValues: SortFieldItem[] = [
    { label: t('common|Default'), field: SortField.ID },
    { label: t('stake|apr'), field: SortField.APR },
    { label: t('stake|apy'), field: SortField.APY },
    { label: t('stake|tvl'), field: SortField.TVL }
  ];

  const sortUserValues: SortFieldItem[] = [
    { label: t('stake|balance'), field: SortField.BALANCE },
    { label: t('stake|deposit'), field: SortField.DEPOSIT },
    { label: t('stake|earned'), field: SortField.EARNED }
  ];

  const sortingValues = isNull(accountPkh) ? sortValues : sortValues.concat(sortUserValues);
  const sortingValue = sortingValues
    .map(item => ({
      ...item,
      label: `Sorted by ${item.label}`
    }))
    .find(({ field }) => field === sortField);

  const sortDirectionRotate = sortDirection === SortDirection.ASC;

  return {
    sortingValue,
    sortDirectionRotate,
    sortingValues,
    handleSortFieldChange,
    handleSortDirectionToggle
  };
};
