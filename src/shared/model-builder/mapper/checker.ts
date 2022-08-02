import { isNull, isUndefined } from '@shared/helpers';

export const checker = <T>(arg: T, optional: boolean, nullable: boolean) => {
  if (isUndefined(arg) && optional) {
    return true;
  }

  return isNull(arg) && nullable;
};
