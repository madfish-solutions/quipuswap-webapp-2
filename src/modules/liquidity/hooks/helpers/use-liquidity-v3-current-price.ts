import { calculateTokenPriceDecimals } from '@modules/liquidity/pages/v3-item-page/helpers';
import { convertToAtomicPrice } from '@modules/liquidity/pages/v3-item-page/helpers/convert-to-atomic-price';
import { isExist, toReal } from '@shared/helpers';

import { useLiquidityV3ItemStore } from '../store';
import { useLiquidityV3ItemTokens } from './use-liquidity-v3-item-tokens';

export const useLiquidityV3CurrentPrice = () => {
  const { tokenX, tokenY } = useLiquidityV3ItemTokens();
  const { sqrtPrice } = useLiquidityV3ItemStore();
  const tokenPriceDecimals = calculateTokenPriceDecimals(tokenX, tokenY);

  return isExist(sqrtPrice) ? toReal(convertToAtomicPrice(sqrtPrice), tokenPriceDecimals) : null;
};
