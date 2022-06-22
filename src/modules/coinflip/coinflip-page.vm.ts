import { useEffect, useRef, useState } from 'react';

import { useRootStore } from '@providers/root-store-provider';
import { useReady } from '@providers/use-dapp';
import { useAuthStore } from '@shared/hooks';

import { useCoinflipStore, useGamesUserInfo } from './hooks';

export const useCoinflipPageViewModel = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const coinflipStore = useCoinflipStore();
  const token = coinflipStore?.token;
  const rootStore = useRootStore();
  const dAppReady = useReady();
  const { accountPkh } = useAuthStore();
  const prevAccountPkhRef = useRef<Nullable<string>>(accountPkh);
  const { getGamesUserInfo } = useGamesUserInfo();

  useEffect(() => {
    if (!dAppReady && prevAccountPkhRef.current === accountPkh) {
      return;
    }
    void getGamesUserInfo(accountPkh);
    prevAccountPkhRef.current = accountPkh;
  }, [getGamesUserInfo, dAppReady, accountPkh, token]);

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
