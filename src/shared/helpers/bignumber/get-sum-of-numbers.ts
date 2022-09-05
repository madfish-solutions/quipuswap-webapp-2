import BigNumber from 'bignumber.js';

import { Nullable } from '../../types';
import { isExist } from '../index';

const ZERO_AMOUNT = 0;

export const getSumOfNumbers = (numbersList: Nullable<BigNumber>[]) =>
  numbersList.some(isExist) ? BigNumber.sum(...numbersList.filter(isExist)) : new BigNumber(ZERO_AMOUNT);
