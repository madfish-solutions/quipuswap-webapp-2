import { FormEvent } from 'react';

import cx from 'classnames';

import { useStableswapFarmFilterStore } from '@modules/stableswap/hooks';
import { ListFilterViewProps } from '@shared/components';
import { isDirrectOrder, isNull } from '@shared/helpers';
import { useAuthStore } from '@shared/hooks';
import { useTranslation } from '@translation';

import { StableswapFarmSortField, StableswapFarmSortFieldItem } from '../../types';
import styles from './stableswap-farm-list-filter.module.scss';

export const useStableswapFarmListFilterViewModel = (): ListFilterViewProps => {
  const { t } = useTranslation();
  const stableswapFarmFilterStore = useStableswapFarmFilterStore();
  const { accountPkh } = useAuthStore();
  const { search, tokenIdValue, whitelistedOnly, stakedOnly, sortField, sortDirection } = stableswapFarmFilterStore;

  const handleSortFieldChange = (value: unknown) => {
    const item = value as StableswapFarmSortFieldItem;

    return stableswapFarmFilterStore.onSortFieldChange(item.field);
  };

  const handleSortDirectionToggle = () => {
    return stableswapFarmFilterStore.onSortDirectionToggle();
  };

  const sortValues: StableswapFarmSortFieldItem[] = [
    { label: t('common|Default'), field: StableswapFarmSortField.ID },
    { label: t('stableswap|apr'), field: StableswapFarmSortField.APR },
    { label: t('stableswap|apy'), field: StableswapFarmSortField.APY },
    { label: t('stableswap|tvl'), field: StableswapFarmSortField.TVL }
  ];

  const sortUserValues: StableswapFarmSortFieldItem[] = [
    { label: t('stableswap|deposit'), field: StableswapFarmSortField.DEPOSIT },
    { label: t('stableswap|earned'), field: StableswapFarmSortField.EARNED }
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
    return stableswapFarmFilterStore.setStakedOnly(state);
  };

  const setWhitelistedOnly = (state: boolean) => {
    return stableswapFarmFilterStore.setWhitelistedOnly(state);
  };

  const onSearchChange = (e: FormEvent<HTMLInputElement>) => {
    if (isNull(e)) {
      return;
    }
    stableswapFarmFilterStore.onSearchChange((e.target as HTMLInputElement).value);
  };

  const onTokenIdChange = (e: FormEvent<HTMLInputElement>) => {
    if (isNull(e) || isNull(e.target)) {
      return;
    }
    stableswapFarmFilterStore.onTokenIdChange((e.target as HTMLInputElement).value);
  };

  const handleIncrement = () => {
    stableswapFarmFilterStore.handleIncrement();
  };

  const handleDecrement = () => {
    stableswapFarmFilterStore.handleDecrement();
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
