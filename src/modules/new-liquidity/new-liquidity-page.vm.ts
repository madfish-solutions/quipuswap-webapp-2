import { useEffect, useState } from 'react';

import { useRootStore } from '@providers/root-store-provider';
import { isNull } from '@shared/helpers';

export const useNewLiquidityViewModel = () => {
  const [isInitialazied, setIsInitialazied] = useState(false);
  const rootStore = useRootStore();

  useEffect(() => {
    (async () => {
      try {
        if (isNull(rootStore.newLiquidityStore)) {
          await rootStore.createNewLiquidityStore();
        }
      } finally {
        setIsInitialazied(true);
      }
    })();
  }, [rootStore]);

  return { isInitialazied };
};
