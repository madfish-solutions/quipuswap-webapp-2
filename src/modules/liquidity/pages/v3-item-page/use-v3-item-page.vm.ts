import { useEffect } from 'react';

import { useLiquidityV3PoolStats } from '@modules/liquidity/hooks';

import { useGetLiquidityV3Item } from '../../../liquidity/hooks/loaders/use-get-liquidity-v3-item';

export const useV3ItemPageViewModel = () => {
  const { getLiquidityV3Item } = useGetLiquidityV3Item();
  const { stats } = useLiquidityV3PoolStats();

  useEffect(() => {
    void getLiquidityV3Item();
  }, [getLiquidityV3Item]);

  return { stats };
};
