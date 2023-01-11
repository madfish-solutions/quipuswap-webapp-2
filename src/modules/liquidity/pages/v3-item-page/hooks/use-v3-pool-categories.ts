import { useMemo } from 'react';

import { useLiquidityV3ItemTokens, useLiquidityV3PoolStore } from '@modules/liquidity/hooks';

import { getV3PoolCategories } from '../helpers';

export const useV3PoolCategories = () => {
  const store = useLiquidityV3PoolStore();
  const { tokenX, tokenY } = useLiquidityV3ItemTokens();

  return useMemo(() => getV3PoolCategories(store.poolId, tokenX, tokenY), [store.poolId, tokenX, tokenY]);
};
