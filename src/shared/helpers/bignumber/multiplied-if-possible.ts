import { BigNumber } from 'bignumber.js';

import { Nullable, Optional } from '@shared/types';

import { isExist } from '../type-checks';

export const multipliedIfPossible = (
  first: Optional<BigNumber.Value>,
  second: Optional<BigNumber.Value>
): Nullable<BigNumber> => {
  if (isExist(first) && isExist(second)) {
    return new BigNumber(first).multipliedBy(second);
  }

  return null;
};
