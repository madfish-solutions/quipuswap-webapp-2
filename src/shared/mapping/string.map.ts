import { checker } from '../model-builder';

export const stringMapper = (arg: unknown, optional: boolean, nullable: boolean) => {
  if (checker(arg, optional, nullable)) {
    return arg;
  }

  return String(arg);
};
