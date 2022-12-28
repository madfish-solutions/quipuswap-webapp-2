import { calculateV3PoolPriceDecimals } from '@modules/liquidity/helpers';

import { useLiquidityV3ItemTokens } from './use-liquidity-v3-item-tokens';

export const useV3PoolPriceDecimals = () => {
  const { tokenX, tokenY } = useLiquidityV3ItemTokens();

  return calculateV3PoolPriceDecimals(tokenX, tokenY);
};
