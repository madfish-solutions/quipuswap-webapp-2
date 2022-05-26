import { useEffect } from 'react';

import { useToasts } from '@shared/utils';

import { useCoinflipStore } from './stores';

export const useCoinflipGeneralStats = () => {
  const conflipStore = useCoinflipStore();
  const token = conflipStore?.token;
  const { showErrorToast } = useToasts();

  useEffect(() => {
    try {
      void conflipStore?.generalStats.load();
    } catch (error) {
      showErrorToast(error as Error);
    }
  }, [conflipStore?.generalStats, showErrorToast, token]);

  return { isLoading: Boolean(conflipStore?.generalStats.isLoading) };
};
