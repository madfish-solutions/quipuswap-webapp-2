import { isNull, isUndefined } from '@shared/helpers';
import { Undefined } from '@shared/types';

export const checker = <T>(arg: T, optional: Undefined<boolean>, nullable: Undefined<boolean>) => {
  if (isUndefined(arg) && optional) {
    return true;
  }

  return isNull(arg) && nullable;
};
