export const useCurrentTick = () => {
  return '';
};

// import { useMemo } from 'react';

// import { useLiquidityV3CurrentPrice, useV3PoolPriceDecimals } from '@modules/liquidity/hooks';
// import { toAtomicIfPossible } from '@shared/helpers';

// import { calculateTickIndex } from '../../../helpers/v3-liquidity-helpers';
// import { useTickSpacing } from './use-tick-spacing';

// export const useCurrentTick = () => {
//   const currentPrice = useLiquidityV3CurrentPrice();
//   const tickSpacing = useTickSpacing();
//   const priceDecimals = useV3PoolPriceDecimals();

//   return useMemo(() => {
//     const currentAtomicPrice = toAtomicIfPossible(currentPrice, priceDecimals);

//     return (
//       currentAtomicPrice && {
//         price: currentAtomicPrice,
//         index: calculateTickIndex(currentAtomicPrice, tickSpacing)
//       }
//     );
//   }, [currentPrice, priceDecimals, tickSpacing]);
// };
