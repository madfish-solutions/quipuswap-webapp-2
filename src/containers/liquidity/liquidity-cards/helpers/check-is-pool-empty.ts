import BigNumber from 'bignumber.js';

import { EMPTY_POOL_AMOUNT } from '@app.config';
import { isNull } from '@utils/helpers';
import { Nullable } from '@utils/types';

export const checkIsPoolEmpty = (tokenPool: Nullable<BigNumber>) =>
  isNull(tokenPool) || tokenPool.eq(EMPTY_POOL_AMOUNT);
