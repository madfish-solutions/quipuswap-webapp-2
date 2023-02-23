import { useEffect, useState } from 'react';

import { useRootStore } from '@providers/root-store-provider';
import { isNull } from '@shared/helpers';

export const useSwapOrSendPageViewModel = () => {
  const rootStore = useRootStore();
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      if (isNull(rootStore.swapStore)) {
        await rootStore.createSwapStore();
      }
      setIsInitialized(true);
    })();
  }, [rootStore]);

  return { isInitialized };
};
