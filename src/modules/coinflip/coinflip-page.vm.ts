import { useEffect, useRef, useState } from 'react';

import { useRootStore } from '@providers/root-store-provider';
import { useAccountPkh, useReady } from '@providers/use-dapp';

import { useGetGamesUserInfo } from './hooks';

export const useCoinflipPageViewModel = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const rootStore = useRootStore();
  const dAppReady = useReady();
  const accountPkh = useAccountPkh();
  const prevAccountPkhRef = useRef<Nullable<string>>(accountPkh);
  const { getGamesUserInfo } = useGetGamesUserInfo();

  useEffect(() => {
    if (!dAppReady && prevAccountPkhRef.current === accountPkh) {
      return;
    }
    void getGamesUserInfo();
    prevAccountPkhRef.current = accountPkh;
  }, [getGamesUserInfo, dAppReady, accountPkh]);

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
