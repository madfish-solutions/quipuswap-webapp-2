import BigNumber from 'bignumber.js';

import { Nullable } from '../../types';
import { isExist } from '../index';

const ZERO_AMOUNT = 0;

export const getSumOfNumbers = (numbersList: Nullable<BigNumber>[]) => {
  if (numbersList.some(isExist)) {
    return numbersList.reduce<BigNumber>(
      (prevValue, currentValue) => prevValue.plus(currentValue ?? ZERO_AMOUNT),
      new BigNumber(ZERO_AMOUNT)
    );
  }

  return new BigNumber(ZERO_AMOUNT);
};
