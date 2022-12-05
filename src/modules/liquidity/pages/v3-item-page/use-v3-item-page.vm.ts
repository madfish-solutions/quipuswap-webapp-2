import { useEffect } from 'react';

import { useGetLiquidityV3Item } from '../../../liquidity/hooks/loaders/use-get-liquidity-v3-item';

export const useV3ItemPageViewModel = () => {
  const { getLiquidityV3Item } = useGetLiquidityV3Item();

  useEffect(() => {
    void getLiquidityV3Item();
  }, [getLiquidityV3Item]);
};
