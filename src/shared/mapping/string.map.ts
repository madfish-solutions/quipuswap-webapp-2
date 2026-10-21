import { Undefined } from '@shared/types';

import { checker } from '../model-builder/mapper/checker';

export const stringMapper = (arg: unknown, optional: Undefined<boolean>, nullable: Undefined<boolean>) => {
  if (checker(arg, optional, nullable)) {
    return arg;
  }

  return String(arg);
};
