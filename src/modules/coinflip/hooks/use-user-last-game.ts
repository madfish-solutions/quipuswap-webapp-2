import { useCallback, useEffect, useRef } from 'react';

import { useRootStore } from '@providers/root-store-provider';
import { useReady } from '@providers/use-dapp';
import { useGlobalModalsState } from '@providers/use-global-modals-state';
import { isNull } from '@shared/helpers';
import { useToasts } from '@shared/utils';

import { getGameResult, Statuses } from '../helpers';
import { useCoinflipStore } from './stores';
import { useLastGameResultAmplitude } from './use-last-game-result-amplitude';

export const useUserLastGame = () => {
  const { tezos } = useRootStore();
  const { showErrorToast } = useToasts();
  const coinflipStore = useCoinflipStore();
  const isReady = useReady();
  const lastGameResultRef = useRef<Nullable<Statuses>>(null);
  const { openCoinflipModal } = useGlobalModalsState();
  const { lastGameLogEvent } = useLastGameResultAmplitude(
    coinflipStore?.token,
    coinflipStore?.tokenToPlay,
    coinflipStore?.userLastGameInfo?.data?.bidSize,
    coinflipStore?.userLastGameInfo?.data?.status
  );

  useEffect(() => {
    const gameResult = getGameResult(coinflipStore?.userLastGameInfo?.data?.status);

    // TODO: avoid excess render
    if (lastGameResultRef.current === Statuses.started && gameResult !== Statuses.started) {
      openCoinflipModal();
      lastGameLogEvent();
    }

    lastGameResultRef.current = gameResult;
  }, [coinflipStore?.userLastGameInfo?.data?.status, lastGameLogEvent, openCoinflipModal, tezos]);

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
