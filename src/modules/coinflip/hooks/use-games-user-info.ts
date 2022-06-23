import { useCallback } from 'react';

import { serverIsUnavailableMessage } from '@config/constants';
import { useReady } from '@providers/use-dapp';
import { isNull } from '@shared/helpers';
import { useToasts } from '@shared/utils';

import { useCoinflipStore } from './stores';

export const useGamesUserInfo = () => {
  const { showErrorToast } = useToasts();
  const coinflipStore = useCoinflipStore();
  const isReady = useReady();

  const getGamesUserInfo = useCallback(
    async (accountPkh: Nullable<string>) => {
      if (isReady && !isNull(coinflipStore) && !isNull(accountPkh)) {
        try {
          await coinflipStore.gamesCountStore.load();
          await coinflipStore.tokensWonStore.load();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          if (error.message.includes('503 Service Temporarily Unavailable')) {
            return showErrorToast(serverIsUnavailableMessage);
          }
          showErrorToast(error as Error);
        }
      }
    },
    [isReady, showErrorToast, coinflipStore]
  );

  return {
    getGamesUserInfo
  };
};
