import { FormEvent } from 'react';

import { useTranslation } from '@translation';

import { useFarmingFilterStore } from '@modules/farming/hooks';
import { isNull } from '@shared/helpers';
import { useAuthStore } from '@shared/hooks';

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

  const onSearchChange = (e: FormEvent<HTMLInputElement>) => {
    if (isNull(e)) {
      return;
    }
    farmingFilterStore.onSearchChange((e.target as HTMLInputElement).value);
  };

  const onTokenIdChange = (e: FormEvent<HTMLInputElement>) => {
    if (isNull(e) || isNull(e.target)) {
      return;
    }
    farmingFilterStore.onTokenIdChange((e.target as HTMLInputElement).value);
  };

  const handleIncrement = () => {
    farmingFilterStore.handleIncrement();
  };

  const handleDecrement = () => {
    farmingFilterStore.handleDecrement();
  };

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
    translation
  };
};
