import { useCallback, useState } from 'react';

import { useReady } from '@providers/use-dapp';
import { isNull } from '@shared/helpers';
import { useToasts } from '@shared/utils';

import { useCoinflipStore } from './stores';

export const useGamesUserInfo = () => {
  const { showErrorToast } = useToasts();
  const coinflipStore = useCoinflipStore();
  const isReady = useReady();
  const [isLoading, setLoading] = useState(false);

  const getGamesUserInfo = useCallback(async () => {
    if (isReady && !isNull(coinflipStore)) {
      try {
        await coinflipStore.gamesCountStore.load();
        await coinflipStore.tokenWonStore.load();
        await coinflipStore.tokensWonStore.load();
      } catch (error) {
        showErrorToast(error as Error);
      } finally {
        setLoading(false);
      }
    }
  }, [isReady, showErrorToast, coinflipStore]);

  return { isLoadingGamesInfo: isLoading, getGamesUserInfo };
};
