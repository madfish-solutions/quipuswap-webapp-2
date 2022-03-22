import { FormEvent } from 'react';

import { useTranslation } from 'next-i18next';

import { useAuthStore } from '@hooks/stores/use-auth-store';
import { useStakingFilterStore } from '@hooks/stores/use-staking-filter-store';
import { isNull } from '@utils/helpers';

export const useListFilterViewModel = () => {
  const { t } = useTranslation(['common', 'stake']);
  const stakingFilterStore = useStakingFilterStore();
  const { accountPkh } = useAuthStore();

  const { search, tokenIdValue, activeOnly, stakedOnly } = stakingFilterStore;

  const setStakedOnly = (state: boolean) => {
    return stakingFilterStore.setStakedOnly(state);
  };

  const setActiveOnly = (state: boolean) => {
    return stakingFilterStore.setActiveOnly(state);
  };

  const onSearchChange = (e: FormEvent<HTMLInputElement>) => {
    if (isNull(e)) {
      return;
    }
    stakingFilterStore.onSearchChange((e.target as HTMLInputElement).value);
  };

  const onTokenIdChange = (e: FormEvent<HTMLInputElement>) => {
    if (isNull(e) || isNull(e.target)) {
      return;
    }
    stakingFilterStore.onTokenIdChange((e.target as HTMLInputElement).value);
  };

  const handleIncrement = () => {
    stakingFilterStore.handleIncrement();
  };

  const handleDecrement = () => {
    stakingFilterStore.handleDecrement();
  };

  const translation = {
    inputPlaceholderTranslation: t('common|Search'),
    numberInputPlaceholderTranslation: t('common|Token ID'),
    stakedOnlyTranslation: t('stake|stakedOnly'),
    activeOnlyTranslation: t('stake|activeOnly')
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
    translation
  };
};
