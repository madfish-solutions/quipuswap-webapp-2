import { BigNumber } from 'bignumber.js';

import { ZERO_AMOUNT } from '@config/constants';

import { Optional } from '../types';

export const isGreaterThanZero = (value: BigNumber.Value) => new BigNumber(value).isGreaterThan(ZERO_AMOUNT);
export const isOptionalGreaterThanZero = (value: Optional<BigNumber>) => value && isGreaterThanZero(value);
