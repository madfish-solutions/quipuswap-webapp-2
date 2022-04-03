import BigNumber from 'bignumber.js';

import { EMPTY_POOL_AMOUNT } from '@config/config';
import { isNull } from '@shared/helpers';
import { Nullable } from '@shared/types';

export const checkIsPoolEmpty = (tokenPool: Nullable<BigNumber>) =>
  isNull(tokenPool) || tokenPool.eq(EMPTY_POOL_AMOUNT);
