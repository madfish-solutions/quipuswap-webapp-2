import { useState, useEffect } from 'react';

import { useRootStore } from '@providers/root-store-provider';
import { isNull } from '@shared/helpers';

export const useStableFarmRouterViewModel = () => {
  const [isInitialazied, setIsInitialazied] = useState(false);
  const [error, setError] = useState<Nullable<Error>>(null);
  const rootStore = useRootStore();

  useEffect(() => {
    (async () => {
      try {
        if (isNull(rootStore.stableFarmListStore)) {
          await rootStore.createStableFarmListStore();
        }
        setIsInitialazied(true);
      } catch (_error) {
        setError(_error as Error);
      }
    })();
  }, [rootStore]);

  return { isInitialazied, error };
};
