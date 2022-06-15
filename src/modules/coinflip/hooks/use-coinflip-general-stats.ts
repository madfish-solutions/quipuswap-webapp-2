import { useEffect } from 'react';

import { useToasts } from '@shared/utils';

import { useCoinflipStore } from './stores';

export const useCoinflipGeneralStats = () => {
  const coinflipStore = useCoinflipStore();
  const token = coinflipStore?.token;
  const { showErrorToast } = useToasts();

  useEffect(() => {
    try {
      void coinflipStore?.generalStats.load();
    } catch (error) {
      showErrorToast(error as Error);
    }
  }, [coinflipStore?.generalStats, showErrorToast, token]);

  return { isLoading: Boolean(coinflipStore?.generalStats.isLoading) };
};
