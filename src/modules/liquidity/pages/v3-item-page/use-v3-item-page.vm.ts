import { useEffect } from 'react';

import { useParams } from 'react-router-dom';

import {
  useLiquidityV3PoolStore,
  useLiquidityV3ItemTokens,
  useLiquidityV3PositionsStore
} from '@modules/liquidity/hooks';
import { useGetLiquidityV3ItemBalances } from '@modules/liquidity/hooks/loaders/use-get-liquidity-v3-item-balances';
import { LiquidityTabs } from '@modules/liquidity/liquidity-routes.enum';
import { isEqual, isNull } from '@shared/helpers';

import { useGetLiquidityV3Pool } from '../../hooks/loaders/use-get-liquidity-v3-pool';

export const useV3ItemPageViewModel = () => {
  const { getLiquidityV3ItemBalances } = useGetLiquidityV3ItemBalances();
  const v3PoolStore = useLiquidityV3PoolStore();
  const v3PositionsStore = useLiquidityV3PositionsStore();
  const { getLiquidityV3Pool } = useGetLiquidityV3Pool();
  const { tokenX, tokenY } = useLiquidityV3ItemTokens();
  const { tab } = useParams();

  const poolId = v3PositionsStore.poolId;

  const isLoading = v3PoolStore.itemIsLoading || isNull(tokenX) || isNull(tokenY);
  const error = v3PoolStore.error ?? v3PoolStore.contractBalanceStore.error;

  const isAddLiqForm = isEqual(tab, LiquidityTabs.add);
  const tabId = (tab as LiquidityTabs) || LiquidityTabs.add;

  useEffect(() => {
    void getLiquidityV3Pool();
    void getLiquidityV3ItemBalances();
    void v3PositionsStore.positionsStore.load();
  }, [getLiquidityV3ItemBalances, getLiquidityV3Pool, v3PositionsStore.positionsStore, poolId]);

  return { isLoading, error, isAddLiqForm, tabId };
};
