import { Undefined } from '@shared/types';

import { checker } from '../model-builder';

export const dateMapper = (arg: unknown, optional: Undefined<boolean>, nullable: Undefined<boolean>) => {
  if (checker(arg, optional, nullable)) {
    return arg;
  }

  return new Date(arg as string);
};
