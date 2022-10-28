import { useEffect, useState } from 'react';

import { useRootStore } from '@providers/root-store-provider';
import { isNull } from '@shared/helpers';

export const useLiquidityRouterViewModel = () => {
  const rootStore = useRootStore();
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      if (isNull(rootStore.liquidityListStore)) {
        await rootStore.createLiquidityListStore();
      }
      if (isNull(rootStore.liquidityListFiltersStore)) {
        await rootStore.createLiquidityListFiltersStore();
      }

      if (isNull(rootStore.liquidityItemStore)) {
        await rootStore.createLiquidityItemStore();
      }
      setIsInitialized(true);
    })();
  }, [rootStore]);

  return { isInitialized };
};
