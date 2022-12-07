import { useEffect } from 'react';

import {
  useLiquidityV3ItemStore,
  useLiquidityV3ItemTokens,
  useLiquidityV3PositionsStore
} from '@modules/liquidity/hooks';
import { isNull } from '@shared/helpers';

import { useGetLiquidityV3Item } from '../../../liquidity/hooks/loaders/use-get-liquidity-v3-item';

export const useV3ItemPageViewModel = () => {
  const v3ItemStore = useLiquidityV3ItemStore();
  const v3PositionsStore = useLiquidityV3PositionsStore();
  const { getLiquidityV3Item } = useGetLiquidityV3Item();
  const { tokenX, tokenY } = useLiquidityV3ItemTokens();

  const poolId = v3PositionsStore.poolId;

  const isLoading = v3ItemStore.itemIsLoading || isNull(tokenX) || isNull(tokenY);
  const error = v3ItemStore.error ?? v3ItemStore.contractBalanceStore.error;

  useEffect(() => {
    void v3PositionsStore.positionsStore.load();
  }, [v3PositionsStore, poolId]);

  useEffect(() => {
    void getLiquidityV3Item();
  }, [getLiquidityV3Item]);

  return { isLoading, error };
};
