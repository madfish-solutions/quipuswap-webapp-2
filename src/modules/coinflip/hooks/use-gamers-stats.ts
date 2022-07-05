import { useCallback } from 'react';

import { useReady } from '@providers/use-dapp';
import { isNull } from '@shared/helpers';
import { useAuthStore } from '@shared/hooks';
import { useToasts } from '@shared/utils';

import { useCoinflipStore } from './stores';

export const useGamersStats = () => {
  const { showErrorToast } = useToasts();
  const coinflipStore = useCoinflipStore();
  const isReady = useReady();
  const { accountPkh } = useAuthStore();

  const getGamersStats = useCallback(async () => {
    if (isReady && !isNull(coinflipStore) && !isNull(accountPkh)) {
      try {
        await coinflipStore.gamersStatsInfo.load();
      } catch (error) {
        showErrorToast(error as Error);
      }
    }
  }, [isReady, showErrorToast, coinflipStore, accountPkh]);

  return {
    getGamersStats
  };
};
