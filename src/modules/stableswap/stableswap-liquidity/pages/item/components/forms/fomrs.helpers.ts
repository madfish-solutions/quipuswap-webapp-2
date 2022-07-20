import { BigNumber } from 'bignumber.js';

export const getInputsAmountFormFormikValues = <T extends { [key: string]: string }>(values: T) =>
  Object.values(values).map(value => new BigNumber(value));
