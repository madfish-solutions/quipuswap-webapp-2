import { checker } from '../model-builder';

export const numberMapper = (arg: unknown, optional: boolean, nullable: boolean) => {
  if (checker(arg, optional, nullable)) {
    return arg;
  }

  const result = Number(arg);

  if (Number.isNaN(result)) {
    throw TypeError();
  }

  return result;
};
