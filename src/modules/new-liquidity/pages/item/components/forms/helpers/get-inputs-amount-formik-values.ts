import BigNumber from 'bignumber.js';

import { saveBigNumber } from '@shared/helpers';

export const getInputsAmountFormFormikValues = <T extends { [key: string]: string }>(values: T) => {
  return Object.keys(values)
    .sort(undefined)
    .map(key => saveBigNumber(values[key], new BigNumber('0')));
};
