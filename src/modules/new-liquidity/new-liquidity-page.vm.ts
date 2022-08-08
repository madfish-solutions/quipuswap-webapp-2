import { useEffect, useState } from 'react';

import { useRootStore } from '@providers/root-store-provider';
import { useReady } from '@providers/use-dapp';
import { isNull } from '@shared/helpers';

import { useGetNewLiquidityStats } from './hooks/use-get-new-liquidity-stats';
import { newLiquidityListDataHelper } from './new-liquidity-list-data.helper';
import { useListStatsViewModel } from './use-list-stats.vm';

export const useNewLiquidityViewModel = () => {
  const [isInitialazied, setIsInitialazied] = useState(false);
  const { getNewLiquidityStats } = useGetNewLiquidityStats();
  const { stats } = useListStatsViewModel();
  const { list } = newLiquidityListDataHelper();
  const isReady = useReady();
  const rootStore = useRootStore();

  useEffect(() => {
    (async () => {
      try {
        if (isNull(rootStore.newLiquidityStatsStore)) {
          await rootStore.createNewLiquidityStatsStore();
        }
      } finally {
        setIsInitialazied(true);
      }
    })();
  }, [rootStore]);

  useEffect(() => {
    if (isReady) {
      void getNewLiquidityStats();
    }
  }, [getNewLiquidityStats, isReady]);

  return { isInitialazied, stats, list };
};
