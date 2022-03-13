import { FormEvent, useCallback } from 'react';

import { useAuthStore } from '@hooks/stores/use-auth-store';
import { useStakingListStore } from '@hooks/stores/use-staking-list-store';
import { isNull } from '@utils/helpers';

export const useListFilterViewModel = () => {
  const stakingListStore = useStakingListStore();
  const { accountPkh } = useAuthStore();

  const { search, tokenIdValue } = stakingListStore;

  const setStakedOnly = useCallback(
    (state: boolean) => {
      return stakingListStore.setStakedOnly(state);
    },
    [stakingListStore]
  );

  const setActiveOnly = useCallback(
    (state: boolean) => {
      return stakingListStore.setActiveOnly(state);
    },
    [stakingListStore]
  );

  const onSearchChange = (e: FormEvent<HTMLInputElement>) => {
    if (isNull(e)) {
      return;
    }
    stakingListStore.onSearchChange((e.target as HTMLInputElement).value);
  };

  const onTokenIdChange = (e: FormEvent<HTMLInputElement>) => {
    if (isNull(e) || isNull(e.target)) {
      return;
    }
    stakingListStore.onTokenIdChange((e.target as HTMLInputElement).value);
  };

  const handleIncrement = () => {
    stakingListStore.handleIncrement();
  };

  const handleDecrement = () => {
    stakingListStore.handleDecrement();
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
