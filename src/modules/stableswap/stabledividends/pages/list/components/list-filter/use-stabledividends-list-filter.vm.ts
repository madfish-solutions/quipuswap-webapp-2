import cx from 'classnames';

import { useStableDividendsFilterStore } from '@modules/stableswap/hooks';
import { ListFilterViewProps } from '@shared/components';
import { isDirrectOrder, isNull } from '@shared/helpers';
import { useAuthStore, useBaseFilterStoreConverter } from '@shared/hooks';
import { useTranslation } from '@translation';

import { StableDividendsSortField, StableDividendsSortFieldItem } from '../../types';
import styles from './stabledividends-list-filter.module.scss';

export const useStableDividendsListFilterViewModel = (): ListFilterViewProps => {
  const { t } = useTranslation();
  const stableDividendsFilterStore = useStableDividendsFilterStore();

  const {
    search,
    tokenIdValue,
    sortDirection,

    onSearchChange,
    onTokenIdChange,

    handleIncrement,
    handleDecrement,

    handleSortDirectionToggle
  } = useBaseFilterStoreConverter(stableDividendsFilterStore);

  const { accountPkh } = useAuthStore();
  const { whitelistedOnly, stakedOnly, sortField } = stableDividendsFilterStore;

  const handleSortFieldChange = (value: unknown) => {
    const item = value as StableDividendsSortFieldItem;

    return stableDividendsFilterStore.onSortFieldChange(item.field);
  };

  const sortValues: StableDividendsSortFieldItem[] = [
    { label: t('common|Default'), field: StableDividendsSortField.ID },
    { label: t('stableswap|apr'), field: StableDividendsSortField.APR },
    { label: t('stableswap|apy'), field: StableDividendsSortField.APY },
    { label: t('stableswap|tvl'), field: StableDividendsSortField.TVL }
  ];

  const sortUserValues: StableDividendsSortFieldItem[] = [
    { label: t('stableswap|deposit'), field: StableDividendsSortField.DEPOSIT },
    { label: t('stableswap|earned'), field: StableDividendsSortField.EARNED }
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
    return stableDividendsFilterStore.setStakedOnly(state);
  };

  const setWhitelistedOnly = (state: boolean) => {
    return stableDividendsFilterStore.setWhitelistedOnly(state);
  };

  const switcherDataList = [
    {
      value: stakedOnly,
      onClick: setStakedOnly,
      disabled: isNull(accountPkh),
      switcherDTI: 'stakedOnlySwitcher',
      switcherTranslationDTI: 'stakedOnlySwitcherTranslation',
      translation: t('stableswap|stakedOnly'),
      translationClassName: styles.switcherTranslation,
      className: cx(styles.switcherContainer, styles.switcherStakeOnly)
    },
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
    buttonDTI: 'SSFASC/DESCSortButton'
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
