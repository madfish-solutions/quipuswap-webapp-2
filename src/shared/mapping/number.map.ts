import { Undefined } from '@shared/types';

import { checker } from '../model-builder/mapper/checker';

export const numberMapper = (arg: unknown, optional: Undefined<boolean>, nullable: Undefined<boolean>) => {
  if (checker(arg, optional, nullable)) {
    return arg;
  }

  const result = Number(arg);

  if (Number.isNaN(result)) {
    throw TypeError();
  }

  return result;
};
