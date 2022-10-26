import { BigNumber } from 'bignumber.js';

import { Undefined } from '@shared/types';

import { checker } from '../model-builder';

export const bigNumberMapper = (arg: unknown, optional: Undefined<boolean>, nullable: Undefined<boolean>) => {
  if (checker(arg, optional, nullable)) {
    return arg;
  }

  const result = new BigNumber(arg as BigNumber.Value);

  if (!result.isFinite()) {
    return new BigNumber(Number.MAX_SAFE_INTEGER);
  }

  return result;
};
