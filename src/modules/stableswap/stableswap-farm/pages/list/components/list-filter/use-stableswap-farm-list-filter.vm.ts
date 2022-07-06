import cx from 'classnames';

import { useStableFarmFilterStore } from '@modules/stableswap/hooks';
import { ListFilterViewProps } from '@shared/components';
import { isDirrectOrder, isNull } from '@shared/helpers';
import { useAuthStore, useBaseFilterStoreConverter } from '@shared/hooks';
import { useTranslation } from '@translation';

import { StableFarmSortField, StableFarmSortFieldItem } from '../../types';
import styles from './stablefarm-list-filter.module.scss';

export const useStableFarmListFilterViewModel = (): ListFilterViewProps => {
  const { t } = useTranslation();
  const stableFarmFilterStore = useStableFarmFilterStore();

  const {
    search,
    tokenIdValue,
    sortDirection,

    onSearchChange,
    onTokenIdChange,

    handleIncrement,
    handleDecrement,

    handleSortDirectionToggle
  } = useBaseFilterStoreConverter(stableFarmFilterStore);

  const { accountPkh } = useAuthStore();
  const { whitelistedOnly, stakedOnly, sortField } = stableFarmFilterStore;

  const handleSortFieldChange = (value: unknown) => {
    const item = value as StableFarmSortFieldItem;

    return stableFarmFilterStore.onSortFieldChange(item.field);
  };

  const sortValues: StableFarmSortFieldItem[] = [
    { label: t('common|Default'), field: StableFarmSortField.ID },
    { label: t('stableswap|apr'), field: StableFarmSortField.APR },
    { label: t('stableswap|apy'), field: StableFarmSortField.APY },
    { label: t('stableswap|tvl'), field: StableFarmSortField.TVL }
  ];

  const sortUserValues: StableFarmSortFieldItem[] = [
    { label: t('stableswap|deposit'), field: StableFarmSortField.DEPOSIT },
    { label: t('stableswap|earned'), field: StableFarmSortField.EARNED }
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
    return stableFarmFilterStore.setStakedOnly(state);
  };

  const setWhitelistedOnly = (state: boolean) => {
    return stableFarmFilterStore.setWhitelistedOnly(state);
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
