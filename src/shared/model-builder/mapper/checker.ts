import { isNull, isUndefined } from '@shared/helpers';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const checker = (arg: any, optional: boolean, nullable: boolean) => {
  if (isUndefined(arg) && optional) {
    return true;
  }

  return isNull(arg) && nullable;
};
