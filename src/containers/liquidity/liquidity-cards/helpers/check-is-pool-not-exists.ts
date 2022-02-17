import { Nullable } from '@interfaces/types';
import { isNull } from '@utils/helpers';

import { PairInfo } from '../add-liquidity-form';
import { checkIsPoolEmpty } from './check-is-pool-empty';

export const checkIsPoolNotExists = (pairInfo: Nullable<PairInfo>) =>
  isNull(pairInfo) ||
  checkIsPoolEmpty(pairInfo.tokenAPool ?? null) ||
  checkIsPoolEmpty(pairInfo.tokenBPool ?? null) ||
  checkIsPoolEmpty(pairInfo.totalSupply ?? null);
