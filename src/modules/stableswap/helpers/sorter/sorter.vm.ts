import { useStableswapFilterStore } from '@modules/stableswap/hooks';
import { useTranslation } from '@translation';

import { SortDirection, SortFieldItem, SortField } from './sorter.types';

export const useSorterViewModel = () => {
  const { t } = useTranslation(['farm', 'common']);
  const stableswapFilterStore = useStableswapFilterStore();
  const { sortField, sortDirection } = stableswapFilterStore;

  const handleSortFieldChange = (value: unknown) => {
    const item = value as SortFieldItem;

    return stableswapFilterStore.onSortFieldChange(item.field);
  };

  const handleSortDirectionToggle = () => {
    return stableswapFilterStore.onSortDirectionToggle();
  };

  const sortingValues: SortFieldItem[] = [
    { label: t('common|Default'), field: SortField.ID },
    { label: t('farm|tvl'), field: SortField.TVL }
  ];

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
