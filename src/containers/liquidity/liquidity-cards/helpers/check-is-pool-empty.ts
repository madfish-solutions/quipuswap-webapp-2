import { EMPTY_POOL_AMOUNT } from '@app.config';
import { Optional } from '@utils/types';

import { PairInfo } from '../add-liquidity-form';

export const checkIsPoolEmpty = (pairInfo: Optional<PairInfo>) =>
  Boolean(
    !pairInfo ||
      pairInfo?.tokenAPool.eq(EMPTY_POOL_AMOUNT) ||
      pairInfo?.tokenBPool.eq(EMPTY_POOL_AMOUNT) ||
      pairInfo?.totalSupply.eq(EMPTY_POOL_AMOUNT)
  );
