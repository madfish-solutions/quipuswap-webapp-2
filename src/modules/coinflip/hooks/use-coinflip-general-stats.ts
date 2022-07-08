import { useCallback } from 'react';

import { useReady } from '@providers/use-dapp';
import { isNull } from '@shared/helpers';
import { useToasts } from '@shared/utils';

import { useCoinflipStore } from './stores';

export const useCoinflipGeneralStats = () => {
  const coinflipStore = useCoinflipStore();
  const isReady = useReady();
  const { showErrorToast } = useToasts();

  const getCoinflipGeneralStats = useCallback(async () => {
    if (isReady && !isNull(coinflipStore)) {
      try {
        await coinflipStore.generalStats.load();
      } catch (error) {
        showErrorToast(error as Error);
      }
    }
  }, [isReady, showErrorToast, coinflipStore]);

  return { getCoinflipGeneralStats };
};
