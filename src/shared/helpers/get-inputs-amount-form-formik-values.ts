import BigNumber from 'bignumber.js';

import { saveBigNumber } from './bignumber';

export const getInputsAmountFormFormikValues = <T extends { [key: string]: string }>(values: T) =>
  Object.values(values).map(value => saveBigNumber(value, new BigNumber('0')));