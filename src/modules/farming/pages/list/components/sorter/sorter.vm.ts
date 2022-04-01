import { useTranslation } from 'next-i18next';

import { useFarmingFilterStore } from '@modules/farming/hooks';
import { isNull } from '@shared/helpers';
import { useAuthStore } from '@shared/hooks';

import { SortDirection, SortFieldItem, SortField } from './sorter.types';

export const useSorterViewModel = () => {
  const { t } = useTranslation(['farm', 'common']);
  const farmingFilterStore = useFarmingFilterStore();
  const { sortField, sortDirection } = farmingFilterStore!;
  const { accountPkh } = useAuthStore();

  const handleSortFieldChange = (value: unknown) => {
    const item = value as SortFieldItem;

    return farmingFilterStore!.onSortFieldChange(item.field);
  };

  const handleSortDirectionToggle = () => {
    return farmingFilterStore!.onSortDirectionToggle();
  };

  const sortValues: SortFieldItem[] = [
    { label: t('common|Default'), field: SortField.ID },
    { label: t('farm|apr'), field: SortField.APR },
    { label: t('farm|apy'), field: SortField.APY },
    { label: t('farm|tvl'), field: SortField.TVL }
  ];

  const sortUserValues: SortFieldItem[] = [
    { label: t('farm|balance'), field: SortField.BALANCE },
    { label: t('farm|deposit'), field: SortField.DEPOSIT },
    { label: t('farm|earned'), field: SortField.EARNED }
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
