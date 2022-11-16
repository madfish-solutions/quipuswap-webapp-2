import { SKIP, SWAP } from '@config/constants';

export const sort = (a: number | string, b: number | string) => {
  if (a < b) {
    return SKIP;
  }
  if (a > b) {
    return SWAP;
  }

  return SKIP;
};

export const sortStrings = (a: string, b: string) => sort(a, b);
export const sortNumbers = (a: number, b: number) => sort(a, b);
