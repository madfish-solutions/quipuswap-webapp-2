import { useEffect } from 'react';

import {
  useLiquidityV3PoolStore,
  useLiquidityV3ItemTokens,
  useLiquidityV3PositionsStore
} from '@modules/liquidity/hooks';
import { isNull } from '@shared/helpers';

import { useGetLiquidityV3Pool } from '../../hooks/loaders/use-get-liquidity-v3-pool';

export const useV3ItemPageViewModel = () => {
  const v3PoolStore = useLiquidityV3PoolStore();
  const v3PositionsStore = useLiquidityV3PositionsStore();
  const { getLiquidityV3Pool } = useGetLiquidityV3Pool();
  const { tokenX, tokenY } = useLiquidityV3ItemTokens();

  const poolId = v3PositionsStore.poolId;

  const isLoading = v3PoolStore.itemIsLoading || isNull(tokenX) || isNull(tokenY);
  const error = v3PoolStore.error ?? v3PoolStore.contractBalanceStore.error;

  useEffect(() => {
    void v3PositionsStore.positionsStore.load();
  }, [v3PositionsStore, poolId]);

  useEffect(() => {
    void getLiquidityV3Pool();
  }, [getLiquidityV3Pool]);

  return { isLoading, error };
};
