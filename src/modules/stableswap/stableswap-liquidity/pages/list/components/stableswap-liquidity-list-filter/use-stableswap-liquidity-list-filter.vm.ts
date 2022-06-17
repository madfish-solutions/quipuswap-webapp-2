import { FormEvent } from 'react';

import cx from 'classnames';

import { ListFilterViewProps } from '@shared/components';
import { isDirrectOrder, isNull } from '@shared/helpers';
import { useTranslation } from '@translation';

import { useStableswapFilterStore } from '../../../../../hooks';
import { StableswapLiquiditySortField, StableswapLiquiditySortFieldItem } from '../../types';
import styles from './stableswap-liquidity-list-filter.module.scss';

export const useStableswapLiquidityListFilterViewModel = (): ListFilterViewProps => {
  const { t } = useTranslation();
  const stableswapFilterStore = useStableswapFilterStore();
  const { sortField, sortDirection } = stableswapFilterStore;

  const handleSortFieldChange = (value: unknown) => {
    const item = value as StableswapLiquiditySortFieldItem;

    return stableswapFilterStore.onSortFieldChange(item.field);
  };

  const handleSortDirectionToggle = () => {
    return stableswapFilterStore.onSortDirectionToggle();
  };

  const sortingValues: StableswapLiquiditySortFieldItem[] = [
    { label: t('common|Default'), field: StableswapLiquiditySortField.ID },
    { label: t('farm|tvl'), field: StableswapLiquiditySortField.TVL }
  ];

  const sortingValue = sortingValues
    .map(item => ({
      ...item,
      label: `Sorted by ${item.label}`
    }))
    .find(({ field }) => field === sortField);

  const sortDirectionRotate = isDirrectOrder(sortDirection);

  const { search, tokenIdValue, whitelistedOnly } = stableswapFilterStore;

  const setWhitelistedOnly = (state: boolean) => {
    return stableswapFilterStore.setWhitelistedOnly(state);
  };

  const onSearchChange = (e: FormEvent<HTMLInputElement>) => {
    if (isNull(e)) {
      return;
    }
    stableswapFilterStore.onSearchChange((e.target as HTMLInputElement).value);
  };

  const onTokenIdChange = (e: FormEvent<HTMLInputElement>) => {
    if (isNull(e) || isNull(e.target)) {
      return;
    }
    stableswapFilterStore.onTokenIdChange((e.target as HTMLInputElement).value);
  };

  const handleIncrement = () => {
    stableswapFilterStore.handleIncrement();
  };

  const handleDecrement = () => {
    stableswapFilterStore.handleDecrement();
  };

  const switcherDataList = [
    {
      value: whitelistedOnly,
      onClick: setWhitelistedOnly,
      switcherDTI: 'whitelistedOnlySwitcher',
      switcherTranslationDTI: 'whitelistedOnlySwitcherTranslation',
      translation: t('stableswap|Whitelisted Only'),
      translationClassName: styles.switcherTranslation,
      className: cx(styles.switcherContainer, styles.switcherWhitelistedOnly)
    }
  ];

  const translation = {
    inputPlaceholderTranslation: t('common|Search'),
    numberInputPlaceholderTranslation: t('common|Token ID')
  };

  const sorterProps = {
    sortingValue,
    sortDirectionRotate,
    sortingValues,
    handleSortFieldChange,
    handleSortDirectionToggle
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
