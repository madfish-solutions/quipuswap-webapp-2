import { useEffect } from 'react';

import { Token } from '@shared/types';
import { useToasts } from '@shared/utils';

import { useCoinflipStore } from './stores';

export const useCoinflipGeneralStats = (token: Nullable<Token>) => {
  const conflipStore = useCoinflipStore();
  const { showErrorToast } = useToasts();

  useEffect(() => {
    try {
      void conflipStore?.generalStats.load();
    } catch (error) {
      showErrorToast(error as Error);
    }
  }, [conflipStore?.generalStats, showErrorToast]);

  return { isLoading: !!conflipStore?.generalStats.isLoading };
};
