import { useCallback } from 'react';

import { useReady } from '@providers/use-dapp';
import { isNull } from '@shared/helpers';
import { useToasts } from '@shared/utils';

import { useCoinflipStore } from './stores';

export const useUserLastGame = () => {
  const { showErrorToast } = useToasts();
  const coinflipStore = useCoinflipStore();
  const isReady = useReady();

  const loadUserLastGame = useCallback(async () => {
    if (!isReady || isNull(coinflipStore)) {
      return;
    }
    try {
      await coinflipStore.userLastGameInfo.load();
    } catch (error) {
      showErrorToast(error as Error);
    }
  }, [isReady, showErrorToast, coinflipStore]);

  return {
    loadUserLastGame
  };
};
