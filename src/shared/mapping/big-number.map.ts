import { BigNumber } from 'bignumber.js';

import { checker } from '../model-builder';

export const bigNumberMapper = (arg: unknown, optional: boolean, nullable: boolean) => {
  if (checker(arg, optional, nullable)) {
    return arg;
  }

  return new BigNumber(arg as BigNumber.Value);
};
