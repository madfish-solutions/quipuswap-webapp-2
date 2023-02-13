import { convertToAtomicPrice, isExist, toReal } from '@shared/helpers';

import { useLiquidityV3PoolStore } from '../store';
import { useV3PoolPriceDecimals } from './use-v3-pool-price-decimals';

export const useLiquidityV3CurrentPrice = () => {
  const priceDecimals = useV3PoolPriceDecimals();
  const { sqrtPrice } = useLiquidityV3PoolStore();

  return isExist(sqrtPrice) ? toReal(convertToAtomicPrice(sqrtPrice), priceDecimals) : null;
};
