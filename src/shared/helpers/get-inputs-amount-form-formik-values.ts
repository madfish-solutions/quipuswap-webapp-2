import BigNumber from 'bignumber.js';

import { saveBigNumber } from './bignumber';
import { isExist } from './type-checks';

type SortPredicate = (a: [string, string], b: [string, string]) => number;

export const getInputsAmountFormFormikValues = <T extends { [key: string]: string }>(
  values: T,
  sortPredicate?: SortPredicate
) => {
  const entries = Object.entries(values);
  if (isExist(sortPredicate)) {
    entries.sort(sortPredicate);
  }

  return entries.map(([_, value]) => saveBigNumber(value, new BigNumber('0')));
};
