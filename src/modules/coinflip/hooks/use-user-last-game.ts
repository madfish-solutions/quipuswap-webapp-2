import { useCallback, useEffect, useRef } from 'react';

import { useReady } from '@providers/use-dapp';
import { useGlobalModalsState } from '@providers/use-global-modals-state';
import { isNull } from '@shared/helpers';
import { useToasts } from '@shared/utils';

import { getGameResult, Statuses } from '../helpers';
import { useCoinflipStore } from './stores';

export const useUserLastGame = () => {
  const { showErrorToast } = useToasts();
  const coinflipStore = useCoinflipStore();
  const isReady = useReady();
  const lastGameResultRef = useRef<Nullable<Statuses>>(null);
  const { openCoinflipModal } = useGlobalModalsState();

  useEffect(() => {
    const gameResult = getGameResult(coinflipStore?.userLastGameInfo?.data?.status);

    if (lastGameResultRef.current === Statuses.started && gameResult !== Statuses.started) {
      openCoinflipModal();
    }

    lastGameResultRef.current = gameResult;
  }, [coinflipStore?.userLastGameInfo?.data?.status, openCoinflipModal]);

  const getUserLastGame = useCallback(async () => {
    if (isReady && !isNull(coinflipStore)) {
      try {
        await coinflipStore.userLastGameInfo.load();
      } catch (error) {
        showErrorToast(error as Error);
      }
    }
  }, [isReady, showErrorToast, coinflipStore]);

  return {
    getUserLastGame
  };
};
