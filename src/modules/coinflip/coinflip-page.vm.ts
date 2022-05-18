import { useEffect, useState } from 'react';

import { useRootStore } from '@providers/root-store-provider';

export const useCoinflipPageViewModel = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const rootStore = useRootStore();

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
