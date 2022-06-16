import { FormEvent } from 'react';

import cx from 'classnames';

import { useFarmingFilterStore } from '@modules/farming/hooks';
import { isNull } from '@shared/helpers';
import { useAuthStore } from '@shared/hooks';
import { useTranslation } from '@translation';

import styles from './list-filter.module.scss';

export const useListFilterViewModel = () => {
  const { t } = useTranslation(['common', 'farm']);
  const farmingFilterStore = useFarmingFilterStore();
  const { accountPkh } = useAuthStore();

  const { search, tokenIdValue, activeOnly, stakedOnly } = farmingFilterStore;

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

  const switcherData = [
    {
      value: stakedOnly,
      onClick: setStakedOnly,
      disabled: isNull(accountPkh),
      translation: t('farm|stakedOnly'),
      translationClassName: styles.switcherTranslation,
      className: cx(styles.switcherContainer, styles.switcherStakeOnly)
    },
    {
      value: activeOnly,
      onClick: setActiveOnly,
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

  return {
    search,
    tokenIdValue,
    activeOnly,
    stakedOnly,
    isStakedOnlyDisabled: isNull(accountPkh),
    setStakedOnly,
    setActiveOnly,
    onSearchChange,
    onTokenIdChange,
    handleIncrement,
    handleDecrement,
    translation,
    switcherData
  };
};
