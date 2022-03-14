import { FormEvent, useCallback } from 'react';

import { useAuthStore } from '@hooks/stores/use-auth-store';
import { useStakingFilterStore } from '@hooks/stores/use-staking-filter-store';
import { isNull } from '@utils/helpers';

export const useListFilterViewModel = () => {
  const stakingFilterStore = useStakingFilterStore();
  const { accountPkh } = useAuthStore();

  const { search, tokenIdValue } = stakingFilterStore;

  const setStakedOnly = useCallback(
    (state: boolean) => {
      return stakingFilterStore.setStakedOnly(state);
    },
    [stakingFilterStore]
  );

  const setActiveOnly = useCallback(
    (state: boolean) => {
      return stakingFilterStore.setActiveOnly(state);
    },
    [stakingFilterStore]
  );

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

  return {
    search,
    tokenIdValue,
    isStakedOnlyDisabled: isNull(accountPkh),
    setStakedOnly,
    setActiveOnly,
    onSearchChange,
    onTokenIdChange,
    handleIncrement,
    handleDecrement
  };
};
