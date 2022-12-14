import { useToken } from '@shared/hooks';
import { mapTokenAddress } from '@shared/mapping';

import { useLiquidityV3PoolStore } from '../store';

export const useLiquidityV3ItemTokens = () => {
  const { item } = useLiquidityV3PoolStore();
  const tokenX = useToken(item ? mapTokenAddress(item.storage.constants.token_x) : null);
  const tokenY = useToken(item ? mapTokenAddress(item.storage.constants.token_y) : null);

  return { tokenX, tokenY };
};
