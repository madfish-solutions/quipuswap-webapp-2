import cx from 'classnames';

import styles from '@modules/farming/pages/list/structures/farming-list-filter/farming-list-filter.module.scss';
import { isDirrectOrder, isNull } from '@shared/helpers';
import { useAuthStore, useBaseFilterStoreConverter } from '@shared/hooks';
import { useTranslation } from '@translation';

import { useNewLiquidityListStore } from '../../../../hooks';
import { LiquiditySortField, LiquiditySortFieldItem } from '../../types';

export const useListFilterViewModel = () => {
  const { accountPkh } = useAuthStore();
  const newLiquidityListStore = useNewLiquidityListStore();

  const {
    search,
    tokenIdValue,
    sortDirection,

    onSearchChange,
    onTokenIdChange,

    handleIncrement,
    handleDecrement,

    handleSortDirectionToggle
  } = useBaseFilterStoreConverter(newLiquidityListStore);

  const { showDust, investedOnly, sortField } = newLiquidityListStore;
  const { t } = useTranslation();

  const handleSortFieldChange = (value: unknown) => {
    const item = value as LiquiditySortFieldItem;

    return newLiquidityListStore.onSortFieldChange(item.field);
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

  const setShowDust = (state: boolean) => {
    return newLiquidityListStore.setShowDust(state);
  };
  const setInvestedOnly = (state: boolean) => {
    return newLiquidityListStore.setInvestedOnly(state);
  };

  const switcherDataList = [
    {
      value: showDust,
      onClick: setShowDust,
      disabled: isNull(accountPkh),
      switcherDTI: 'stakedOnlySwitcher',
      translation: t('newLiquidity|showDust'),
      switcherTranslationDTI: 'stakedOnlySwitcherTranslation',
      translationClassName: styles.switcherTranslation,
      className: cx(styles.switcherContainer, styles.switcherStakeOnly)
    },
    {
      value: investedOnly,
      onClick: setInvestedOnly,
      disabled: isNull(accountPkh),
      switcherDTI: 'stakedOnlySwitcher',
      translation: t('newLiquidity|investedOnly'),
      switcherTranslationDTI: 'stakedOnlySwitcherTranslation',
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
    inputDTI,
    shouldShowInputs: false
  };
};