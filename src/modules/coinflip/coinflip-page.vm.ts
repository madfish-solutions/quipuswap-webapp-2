import { useEffect, useRef, useState } from 'react';

import { useRootStore } from '@providers/root-store-provider';
import { useReady } from '@providers/use-dapp';
import { useAuthStore } from '@shared/hooks';

import { useCoinflipGeneralStats, useCoinflipStore, useGamersStats, useGamesUserInfo, useUserLastGame } from './hooks';

export const useCoinflipPageViewModel = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const coinflipStore = useCoinflipStore();
  const token = coinflipStore?.token;
  const rootStore = useRootStore();
  const dAppReady = useReady();
  const { accountPkh } = useAuthStore();
  const prevAccountPkhRef = useRef<Nullable<string>>(accountPkh);
  const { getGamesUserInfo } = useGamesUserInfo();
  const { getCoinflipGeneralStats } = useCoinflipGeneralStats();
  const { getGamersStats } = useGamersStats();
  const { getUserLastGame } = useUserLastGame();

  useEffect(() => {
    (async () => {
      if (!dAppReady && prevAccountPkhRef.current === accountPkh) {
        return;
      }
      await getGamesUserInfo(accountPkh);
      await getCoinflipGeneralStats();
      await getGamersStats();
      await getUserLastGame();
      prevAccountPkhRef.current = accountPkh;
    })();
  }, [getGamesUserInfo, getCoinflipGeneralStats, getGamersStats, getUserLastGame, dAppReady, accountPkh, token]);

  useEffect(() => {
    (async () => {
      try {
        await rootStore.createCoinflipStore();
      } finally {
        setIsInitialized(true);
      }
    })();
  }, [rootStore]);

  return { isInitialized };
};
