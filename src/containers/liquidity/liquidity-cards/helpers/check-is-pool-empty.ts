import { EMPTY_POOL_AMOUNT } from '@app.config';
import { isNull } from '@utils/helpers';
import { Optional } from '@utils/types';

import { PairInfo } from '../add-liquidity-form';

export const checkIsPoolEmpty = (pairInfo: Optional<PairInfo>): boolean =>
  Boolean(
    isNull(pairInfo) ||
      pairInfo?.tokenAPool.eq(EMPTY_POOL_AMOUNT) ||
      pairInfo?.tokenBPool.eq(EMPTY_POOL_AMOUNT) ||
      pairInfo?.totalSupply.eq(EMPTY_POOL_AMOUNT)
  );
