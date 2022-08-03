import { checker } from '../model-builder';

export const booleanMapper = (arg: unknown, optional: boolean, nullable: boolean) => {
  if (checker(arg, optional, nullable)) {
    return arg;
  }

  return Boolean(arg);
};
