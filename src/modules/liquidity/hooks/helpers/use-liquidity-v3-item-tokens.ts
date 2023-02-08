import { useToken } from '@shared/hooks';

import { mapV3TokenAddress } from '../../helpers';
import { useLiquidityV3PoolStore } from '../store';

export const useLiquidityV3ItemTokens = () => {
  const { item } = useLiquidityV3PoolStore();
  const tokenX = useToken(item ? mapV3TokenAddress(item.storage.constants.token_x) : null);
  const tokenY = useToken(item ? mapV3TokenAddress(item.storage.constants.token_y) : null);

  return { tokenX, tokenY };
};
