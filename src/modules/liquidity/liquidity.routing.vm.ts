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
      if (isNull(rootStore.liquidityV3ItemStore)) {
        await rootStore.createLiquidityV3ItemStore();
      }
      if (isNull(rootStore.liquidityV3PositionsStore)) {
        await rootStore.createLiquidityV3PositionsStore();
      }
      setIsInitialized(true);
    })();
  }, [rootStore]);

  return { isInitialized };
};
