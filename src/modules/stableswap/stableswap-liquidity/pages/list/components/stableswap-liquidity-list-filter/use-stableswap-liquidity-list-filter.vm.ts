import cx from 'classnames';

import { ListFilterViewProps } from '@shared/components';
import { isDirrectOrder } from '@shared/helpers';
import { useBaseFilterStoreConverter } from '@shared/hooks';
import { useTranslation } from '@translation';

import { useStableswapFilterStore } from '../../../../../hooks';
import { StableswapSortField, StableswapSortFieldItem } from '../../types';
import styles from './stableswap-liquidity-list-filter.module.scss';

export const useStableswapLiquidityListFilterViewModel = (): ListFilterViewProps => {
  const { t } = useTranslation();
  const stableswapFilterStore = useStableswapFilterStore();

  const {
    search,
    tokenIdValue,
    sortDirection,

    onSearchChange,
    onTokenIdChange,

    handleIncrement,
    handleDecrement,

    handleSortDirectionToggle
  } = useBaseFilterStoreConverter(stableswapFilterStore);

  const { sortField, whitelistedOnly } = stableswapFilterStore;

  const handleSortFieldChange = (value: unknown) => {
    const item = value as StableswapSortFieldItem;

    return stableswapFilterStore.onSortFieldChange(item.field);
  };

  const sortingValues: StableswapSortFieldItem[] = [
    { label: t('common|Default'), field: StableswapSortField.ID },
    { label: t('farm|tvl'), field: StableswapSortField.TVL }
  ];

  const sortingValue = sortingValues
    .map(item => ({
      ...item,
      label: `Sorted by ${item.label}`
    }))
    .find(({ field }) => field === sortField);

  const sortDirectionRotate = isDirrectOrder(sortDirection);

  const setWhitelistedOnly = (state: boolean) => {
    return stableswapFilterStore.setWhitelistedOnly(state);
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
    handleSortDirectionToggle,
    buttonDTI: 'SSLASC/DESCSortButton'
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
