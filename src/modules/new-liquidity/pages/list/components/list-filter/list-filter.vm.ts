import cx from 'classnames';
import { noop } from 'rxjs';

import styles from '@modules/farming/pages/list/structures/farming-list-filter/farming-list-filter.module.scss';
import { isDirrectOrder, isNull } from '@shared/helpers';
import { useAuthStore, useBaseFilterStoreConverter } from '@shared/hooks';
import { useTranslation } from '@translation';

import { useNewLiquidityListStore } from '../../../../hooks';
import { LiquiditySortField, LiquiditySortFieldItem } from '../../types';

export const useListFilterViewModel = () => {
  const { accountPkh } = useAuthStore();
  const farmingFilterStore = useNewLiquidityListStore();

  const {
    search,
    tokenIdValue,
    sortDirection,

    onSearchChange,
    onTokenIdChange,

    handleIncrement,
    handleDecrement,

    handleSortDirectionToggle
  } = useBaseFilterStoreConverter(farmingFilterStore);

  const { sortField } = farmingFilterStore;

  const { showDust } = farmingFilterStore;
  const { t } = useTranslation(['common', 'farm']);

  const handleSortFieldChange = (value: unknown) => {
    const item = value as LiquiditySortFieldItem;

    return farmingFilterStore.onSortFieldChange(item.field);
  };

  const sortingValues: LiquiditySortFieldItem[] = [
    { label: t('common|Default'), field: LiquiditySortField.ID },
    { label: t('farm|tvl'), field: LiquiditySortField.TVL }
  ];

  const sortingValue = sortingValues
    .map(item => ({
      ...item,
      label: `Sorted by ${item.label}`
    }))
    .find(({ field }) => field === sortField);

  const sortDirectionRotate = isDirrectOrder(sortDirection);

  const switcherDataList = [
    {
      value: showDust,
      onClick: noop,
      disabled: isNull(accountPkh),
      switcherDTI: 'stakedOnlySwitcher',
      switcherTranslationDTI: 'stakedOnlySwitcherTranslation',
      translation: t('farm|stakedOnly'),
      translationClassName: styles.switcherTranslation,
      className: cx(styles.switcherContainer, styles.switcherStakeOnly)
    }
  ];

  const inputDTI = {
    searchInputDTI: 'searchInput',
    numberInputDTI: 'numberInput'
  };

  const translation = {
    inputPlaceholderTranslation: t('common|Search'),
    numberInputPlaceholderTranslation: t('common|Token ID'),
    stakedOnlyTranslation: t('farm|stakedOnly'),
    activeOnlyTranslation: t('farm|activeOnly')
  };

  const sorterProps = {
    sortingValue,
    sortingValues,
    sortDirectionRotate,
    handleSortFieldChange,
    handleSortDirectionToggle,
    buttonDTI: 'LiquidityASC/DESCSortButton',
    sorterSelectDTI: 'sorterSelect'
  };

  return {
    search,
    tokenIdValue,
    onSearchChange,
    onTokenIdChange,
    handleIncrement,
    handleDecrement,
    translation,
    sorterProps,
    switcherDataList,
    inputDTI
  };
};
