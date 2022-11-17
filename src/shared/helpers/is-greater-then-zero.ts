import { BigNumber } from 'bignumber.js';

import { ZERO_AMOUNT } from '@config/constants';

import { Optional } from '../types';
import { isExist } from './type-checks';

export const isGreaterThanZero = (value: Optional<BigNumber>) =>
  isExist(value) ? value.isGreaterThan(ZERO_AMOUNT) : false;
export const isOptionalGreaterThanZero = (value: Optional<BigNumber>) => value && isGreaterThanZero(value);
