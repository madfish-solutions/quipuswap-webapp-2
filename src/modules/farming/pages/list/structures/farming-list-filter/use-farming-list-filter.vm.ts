import { useEffect } from 'react';

import cx from 'classnames';

import { useFarmingFilterStore, useFarmingListStore } from '@modules/farming/hooks';
import { ListFilterInputViewProps } from '@shared/components';
import { isNull, isDirectOrder } from '@shared/helpers';
import { useAuthStore, useBaseFilterStoreConverter } from '@shared/hooks';
import { useTranslation } from '@translation';

import { FarmingSortField, FarmingSortFieldItem } from '../../types';
import styles from './farming-list-filter.module.scss';

export const useFarmingListFilterViewModel = (): ListFilterInputViewProps => {
  const { accountPkh } = useAuthStore();
  const farmingFilterStore = useFarmingFilterStore();
  const farmingListStore = useFarmingListStore();

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

  const { activeOnly, stakedOnly, sortField } = farmingFilterStore;
  const { t } = useTranslation(['common', 'farm']);

  const handleSortFieldChange = (value: unknown) => {
    const item = value as FarmingSortFieldItem;

    return farmingFilterStore.onSortFieldChange(item.field);
  };

  const sortValues: FarmingSortFieldItem[] = [
    { label: t('common|Default'), field: FarmingSortField.DEFAULT },
    { label: t('farm|apr'), field: FarmingSortField.APR },
    { label: t('farm|apy'), field: FarmingSortField.APY },
    { label: t('farm|tvl'), field: FarmingSortField.TVL }
  ];

  const sortUserValues: FarmingSortFieldItem[] = [
    { label: t('farm|balance'), field: FarmingSortField.BALANCE },
    { label: t('farm|deposit'), field: FarmingSortField.DEPOSIT },
    { label: t('farm|earned'), field: FarmingSortField.EARNED }
  ];

  const sortingValues = isNull(accountPkh) ? sortValues : sortValues.concat(sortUserValues);
  const sortingValue = sortingValues
    .map(item => ({
      ...item,
      label: `Sorted by ${item.label}`
    }))
    .find(({ field }) => field === sortField);

  const sortDirectionRotate = isDirectOrder(sortDirection);

  const setStakedOnly = (state: boolean) => {
    return farmingFilterStore.setStakedOnly(state);
  };

  const setActiveOnly = (state: boolean) => {
    return farmingFilterStore.setActiveOnly(state);
  };

  useEffect(() => {
    if (isNull(accountPkh)) {
      farmingFilterStore.setStakedOnly(false);
    }
  }, [accountPkh, farmingFilterStore]);

  const switcherDataList = [
    {
      value: stakedOnly,
      onClick: setStakedOnly,
      disabled: isNull(accountPkh) || farmingListStore.balancesAreLoading,
      switcherDTI: 'stakedOnlySwitcher',
      switcherTranslationDTI: 'stakedOnlySwitcherTranslation',
      translation: t('farm|stakedOnly'),
      translationClassName: styles.switcherTranslation,
      className: cx(styles.switcherContainer, styles.switcherStakeOnly)
    },
    {
      value: activeOnly,
      onClick: setActiveOnly,
      switcherDTI: 'activeOnlySwitcher',
      switcherTranslationDTI: 'activeOnlySwitcherTranslation',
      translation: t('farm|activeOnly'),
      translationClassName: styles.switcherTranslation,
      className: cx(styles.switcherContainer, styles.switcherActiveOnly)
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
    sortDirectionRotate,
    sortingValues,
    handleSortFieldChange,
    handleSortDirectionToggle,
    buttonDTI: 'FarmingASC/DESCSortButton',
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
