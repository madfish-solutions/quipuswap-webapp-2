import { isNull } from '@shared/helpers';
import { Nullable } from '@shared/types';

import { checkIsPoolEmpty } from './check-is-pool-empty';
import { PairInfo } from '../add-liquidity-form';

export const checkIsPoolNotExists = (pairInfo: Nullable<PairInfo>) =>
  isNull(pairInfo) ||
  checkIsPoolEmpty(pairInfo.tokenAPool ?? null) ||
  checkIsPoolEmpty(pairInfo.tokenBPool ?? null) ||
  checkIsPoolEmpty(pairInfo.totalSupply ?? null);
