import { useMemo } from 'react';

import { useLiquidityV3CurrentPrice } from '@modules/liquidity/hooks';

import { calculateTickIndex } from '../../helpers';
import { useTickSpacing } from './use-tick-spacing';

export const useCurrentTick = () => {
  const currentPrice = useLiquidityV3CurrentPrice();
  const tickSpacing = useTickSpacing();

  return useMemo(
    () =>
      currentPrice && {
        price: currentPrice,
        index: calculateTickIndex(currentPrice, tickSpacing)
      },
    [currentPrice, tickSpacing]
  );
};
