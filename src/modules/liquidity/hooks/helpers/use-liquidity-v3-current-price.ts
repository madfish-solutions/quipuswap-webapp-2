import { convertToAtomicPrice } from '@modules/liquidity/pages/v3-item-page/helpers';
import { getTokenDecimals, isExist, toReal } from '@shared/helpers';

import { useLiquidityV3ItemStore } from '../store';
import { useLiquidityV3ItemTokens } from './use-liquidity-v3-item-tokens';

export const useLiquidityV3CurrentPrice = () => {
  const { tokenX, tokenY } = useLiquidityV3ItemTokens();
  const { sqrtPrice } = useLiquidityV3ItemStore();
  const tokenPriceDecimals = getTokenDecimals(tokenY) - getTokenDecimals(tokenX);

  return isExist(sqrtPrice) ? toReal(convertToAtomicPrice(sqrtPrice), tokenPriceDecimals) : null;
};
