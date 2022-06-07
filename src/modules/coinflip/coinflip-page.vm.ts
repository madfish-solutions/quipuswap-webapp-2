import { useEffect, useRef, useState } from 'react';

import { useRootStore } from '@providers/root-store-provider';
import { useAccountPkh, useReady } from '@providers/use-dapp';
import { isNull } from '@shared/helpers';

import { useCoinflipStore, useGamesUserInfo } from './hooks';

export const useCoinflipPageViewModel = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const coinflipStore = useCoinflipStore();
  const token = coinflipStore?.token;
  const rootStore = useRootStore();
  const dAppReady = useReady();
  const accountPkh = useAccountPkh();
  const prevAccountPkhRef = useRef<Nullable<string>>(accountPkh);
  const { getGamesUserInfo } = useGamesUserInfo();

  useEffect(() => {
    if (!dAppReady && prevAccountPkhRef.current === accountPkh) {
      return;
    }
    void getGamesUserInfo();
    prevAccountPkhRef.current = accountPkh;
  }, [getGamesUserInfo, dAppReady, accountPkh, token]);

  useEffect(() => {
    (async () => {
      try {
        if (isNull(rootStore.coinflipStore)) {
          await rootStore.createCoinflipStore();
        }
      } finally {
        setIsInitialized(true);
      }
    })();
  }, [rootStore]);

  return { isInitialized };
};
