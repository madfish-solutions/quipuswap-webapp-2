import BigNumber from 'bignumber.js';

import { EMPTY_POOL_AMOUNT } from '@app.config';
import { Nullable } from '@interfaces/types';
import { isNull } from '@utils/helpers';

export const checkIsPoolEmpty = (tokenPool: Nullable<BigNumber>): tokenPool is null =>
  isNull(tokenPool) || tokenPool.eq(EMPTY_POOL_AMOUNT);
