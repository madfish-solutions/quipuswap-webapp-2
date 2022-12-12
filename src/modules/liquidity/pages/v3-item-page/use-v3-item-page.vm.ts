import { useEffect } from 'react';

import { useGetLiquidityV3ItemBalances } from '../../hooks/loaders/use-get-liquidity-v3-item-balances';

export const useV3ItemPageViewModel = () => {
  const { getLiquidityV3ItemBalances } = useGetLiquidityV3ItemBalances();

  useEffect(() => {
    void getLiquidityV3ItemBalances();
  }, [getLiquidityV3ItemBalances]);
};
