import { useLiquidityV3PoolStore } from '@modules/liquidity/hooks';
import { Categories } from '@modules/liquidity/interfaces';

const DEFAULT_CATEGORIES: Categories[] = [];

export const useV3PoolCategories = () => {
  const store = useLiquidityV3PoolStore();

  return store.itemStore.model.item?.poolLabels ?? DEFAULT_CATEGORIES;
};
