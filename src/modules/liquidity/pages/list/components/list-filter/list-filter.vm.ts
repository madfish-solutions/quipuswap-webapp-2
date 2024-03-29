import cx from 'classnames';

import styles from '@modules/farming/pages/list/structures/farming-list-filter/farming-list-filter.module.scss';
import { SwitcherLabelProps } from '@shared/components';
import { isDirectOrder, isNull } from '@shared/helpers';
import { useAmplitudeService, useAuthStore, useBaseFilterStoreConverter } from '@shared/hooks';
import { useTranslation } from '@translation';

import { useLiquidityListFiltersStore } from '../../../../hooks';
import { LiquiditySortField, LiquiditySortFieldItem } from '../../types';

export const useListFilterViewModel = () => {
  const { accountPkh } = useAuthStore();
  const liquidityListFiltersStore = useLiquidityListFiltersStore();

  const {
    search,
    tokenIdValue,
    sortDirection,

    onSearchChange,
    onTokenIdChange,

    handleIncrement,
    handleDecrement,

    handleSortDirectionToggle
  } = useBaseFilterStoreConverter(liquidityListFiltersStore);

  const { showDust, investedOnly, sortField } = liquidityListFiltersStore;
  const { t } = useTranslation();
  const { log } = useAmplitudeService();

  const handleSortFieldChange = (value: unknown) => {
    const item = value as LiquiditySortFieldItem;
    log('LIQUIDITY_SORT_FIELD_CHANGED', { field: item.field });

    return liquidityListFiltersStore.onSortFieldChange(item.field);
  };

  const sortingValues: LiquiditySortFieldItem[] = [{ label: t('farm|tvl'), field: LiquiditySortField.TVL }];

  const sortingValue = sortingValues
    .map(item => ({
      ...item,
      label: `Sorted by ${item.label}`
    }))
    .find(({ field }) => field === sortField);

  const sortDirectionRotate = isDirectOrder(sortDirection);

  const setShowDust = (state: boolean) => {
    log('LIQUIDITY_SHOW_DUST_SET', { state });

    return liquidityListFiltersStore.setShowDust(state);
  };
  const setInvestedOnly = (state: boolean) => {
    log('LIQUIDITY_INVESTED_ONLY_SET', { state });

    return liquidityListFiltersStore.setInvestedOnly(state);
  };

  const switcherDataList: SwitcherLabelProps[] = [
    {
      value: showDust,
      onClick: setShowDust,
      disabled: false,
      switcherDTI: 'stakedOnlySwitcher',
      translation: t('liquidity|showDust'),
      switcherTranslationDTI: 'stakedOnlySwitcherTranslation',
      translationClassName: styles.switcherTranslation,
      className: cx(styles.switcherContainer, styles.switcherStakeOnly)
    }
  ];

  // TODO: Add user balances to items
  const isInvestedOnly = false;
  if (isInvestedOnly) {
    switcherDataList.push({
      value: investedOnly,
      onClick: setInvestedOnly,
      disabled: isNull(accountPkh),
      switcherDTI: 'stakedOnlySwitcher',
      translation: t('liquidity|investedOnly'),
      switcherTranslationDTI: 'stakedOnlySwitcherTranslation',
      translationClassName: styles.switcherTranslation,
      className: cx(styles.switcherContainer, styles.switcherStakeOnly)
    });
  }

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
