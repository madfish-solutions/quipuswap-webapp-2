import BigNumber from 'bignumber.js';

import { Optional } from '@shared/types';

import { isExist } from '../type-checks';

export const sumIfPossible = (summands: Array<Optional<BigNumber.Value>>) =>
  summands.every(isExist) ? BigNumber.sum(...summands) : null;
