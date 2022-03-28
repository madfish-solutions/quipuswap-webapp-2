import { BigNumber } from 'bignumber.js';

import { Nullable, Optional } from '../../types/types';
import { isExist } from './type-checks';

export const multipliedIfPossible = (first: Optional<BigNumber>, second: Optional<BigNumber>): Nullable<BigNumber> => {
  if (isExist(first) && isExist(second)) {
    return first.multipliedBy(second);
  }

  return null;
};
