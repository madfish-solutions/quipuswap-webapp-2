import { useMemo } from 'react';

import { useLiquidityV3CurrentYToXPrice, useV3PoolPriceDecimals } from '@modules/liquidity/hooks';
import { toAtomicIfPossible } from '@shared/helpers';

import { useTickSpacing } from './use-tick-spacing';
import { calculateTickIndex } from '../../../helpers/v3-liquidity-helpers';

export const useCurrentTick = () => {
  const currentPrice = useLiquidityV3CurrentYToXPrice();
  const tickSpacing = useTickSpacing();
  const priceDecimals = useV3PoolPriceDecimals();

  return useMemo(() => {
    const currentAtomicPrice = toAtomicIfPossible(currentPrice, priceDecimals);

    return (
      currentAtomicPrice && {
        price: currentAtomicPrice,
        index: calculateTickIndex(currentAtomicPrice, tickSpacing)
      }
    );
  }, [currentPrice, priceDecimals, tickSpacing]);
};
