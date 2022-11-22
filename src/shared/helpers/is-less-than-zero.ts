import { BigNumber } from 'bignumber.js';

import { ZERO_AMOUNT } from '@config/constants';

import { Optional } from '../types';

export const isLessThanZero = (value: BigNumber.Value) => new BigNumber(value).isLessThan(ZERO_AMOUNT);
export const isOptionalLessThanZero = (value: Optional<BigNumber>) => value && isLessThanZero(value);
