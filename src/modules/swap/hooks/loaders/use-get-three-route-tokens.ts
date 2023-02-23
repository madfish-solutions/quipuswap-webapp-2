import { useCallback } from 'react';

import { useToasts } from '@shared/utils';

import { useSwapStore } from '../use-swap-store';

export const useGetThreeRouteTokens = () => {
  const { showErrorToast } = useToasts();
  const swapStore = useSwapStore();

  const getThreeRouteTokens = useCallback(async () => {
    try {
      await swapStore.threeRouteTokensStore.load();
    } catch (error) {
      showErrorToast(error as Error);
    }
  }, [swapStore, showErrorToast]);

  return { getThreeRouteTokens };
};
