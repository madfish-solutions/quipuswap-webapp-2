import { checker } from '../model-builder';

export const dateMapper = (arg: unknown, optional: boolean, nullable: boolean) => {
  if (checker(arg, optional, nullable)) {
    return arg;
  }

  return new Date(arg as string);
};
