import { isNull } from '@shared/helpers';
import { Nullable } from '@shared/types';

import { PairInfo } from '../add-liquidity-form';
import { checkIsPoolEmpty } from './check-is-pool-empty';

export const checkIsPoolNotExists = (pairInfo: Nullable<PairInfo>) =>
  isNull(pairInfo) ||
  checkIsPoolEmpty(pairInfo.tokenAPool ?? null) ||
  checkIsPoolEmpty(pairInfo.tokenBPool ?? null) ||
  checkIsPoolEmpty(pairInfo.totalSupply ?? null);
