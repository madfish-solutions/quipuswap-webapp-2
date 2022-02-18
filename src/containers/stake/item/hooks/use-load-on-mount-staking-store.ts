import { useEffect, useRef } from 'react';

import { useStakingStore } from '@hooks/stores/use-staking-store';
import { Nullable } from '@utils/types';

export const useLoadOnMountStakingStore = (onError?: (message: string) => void) => {
  const stakingStore = useStakingStore();
  const { error } = stakingStore.list;
  const prevError = useRef<Nullable<Error>>(null);

  /*
    Load data
   */
  useEffect(() => {
    void stakingStore.list.load();
  }, [stakingStore]);

  /*
    Handle errors
   */
  useEffect(() => {
    if (!prevError.current && error) {
      onError?.(error.message);
    }
    prevError.current = error;
  }, [onError, error]);

  return stakingStore;
};
