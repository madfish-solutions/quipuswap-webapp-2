import { useCallback, useEffect, useRef } from 'react';

import { useReady } from '@providers/use-dapp';
import { useGlobalModalsState } from '@providers/use-global-modals-state';
import { isNull } from '@shared/helpers';
import { useToasts } from '@shared/utils';

import { getGameResult, Statuses } from '../helpers';
import { useCoinflipStore } from './stores';
import { useLastGameResultAmplitude } from './use-last-game-result-amplitude';

export const useUserPendingGame = () => {
  const { showErrorToast } = useToasts();
  const coinflipStore = useCoinflipStore();
  const isReady = useReady();
  const lastGameResultRef = useRef<Nullable<Statuses>>(null);
  const { openCoinflipModal } = useGlobalModalsState();
  const { lastGameLogEvent } = useLastGameResultAmplitude();

  useEffect(() => {
    const gameResult = getGameResult(coinflipStore?.pendingGameStore?.model?.status);

    // TODO: avoid excess render
    if (lastGameResultRef.current === Statuses.started && gameResult !== Statuses.started) {
      openCoinflipModal();
      lastGameLogEvent();
    }

    lastGameResultRef.current = gameResult;
  }, [coinflipStore?.pendingGameStore?.model?.status, lastGameLogEvent, openCoinflipModal]);

  const getUserPendingGame = useCallback(async () => {
    if (isReady && !isNull(coinflipStore)) {
      try {
        await coinflipStore.pendingGameStore.load();
      } catch (error) {
        showErrorToast(error as Error);
      }
    }
  }, [isReady, showErrorToast, coinflipStore]);

  return {
    getUserPendingGame
  };
};
