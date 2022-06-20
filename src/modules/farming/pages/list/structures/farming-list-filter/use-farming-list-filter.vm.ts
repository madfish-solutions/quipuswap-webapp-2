import { FormEvent } from 'react';

import cx from 'classnames';

import { useFarmingFilterStore } from '@modules/farming/hooks';
import { ListFilterViewProps } from '@shared/components';
import { isNull, isDirrectOrder } from '@shared/helpers';
import { useAuthStore } from '@shared/hooks';
import { useTranslation } from '@translation';

import { FarmingSortField, FarmingSortFieldItem } from '../../types/sort';
import styles from './farming-list-filter.module.scss';

export const useFarmingListFilterViewModel = (): ListFilterViewProps => {
  const { accountPkh } = useAuthStore();
  const farmingFilterStore = useFarmingFilterStore();
  const { search, tokenIdValue, activeOnly, stakedOnly, sortField, sortDirection } = farmingFilterStore;
  const { t } = useTranslation(['common', 'farm']);

  const handleSortFieldChange = (value: unknown) => {
    const item = value as FarmingSortFieldItem;

    return farmingFilterStore.onSortFieldChange(item.field);
  };

  const handleSortDirectionToggle = () => {
    return farmingFilterStore.onSortDirectionToggle();
  };

  const sortValues: FarmingSortFieldItem[] = [
    { label: t('common|Default'), field: FarmingSortField.ID },
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

  const sortDirectionRotate = isDirrectOrder(sortDirection);

  const setStakedOnly = (state: boolean) => {
    return farmingFilterStore.setStakedOnly(state);
  };

  const setActiveOnly = (state: boolean) => {
    return farmingFilterStore.setActiveOnly(state);
  };

  const onSearchChange = (event: FormEvent<HTMLInputElement>) => {
    if (isNull(event)) {
      return;
    }
    farmingFilterStore.onSearchChange((event.target as HTMLInputElement).value);
  };

  const onTokenIdChange = (event: FormEvent<HTMLInputElement>) => {
    if (isNull(event) || isNull(event.target)) {
      return;
    }
    farmingFilterStore.onTokenIdChange((event.target as HTMLInputElement).value);
  };

  const handleIncrement = () => {
    farmingFilterStore.handleIncrement();
  };

  const handleDecrement = () => {
    farmingFilterStore.handleDecrement();
  };

  const switcherDataList = [
    {
      value: stakedOnly,
      onClick: setStakedOnly,
      disabled: isNull(accountPkh),
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
    buttonDTI: 'FarmingASC/DESCSortButton'
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
    switcherDataList
  };
};
