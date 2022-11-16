import { BigNumber } from 'bignumber.js';

import { Optional } from '../types';

export const isGreaterThanZero = (value: BigNumber) => value.isGreaterThan('0');
export const isOptionalGreaterThanZero = (value: Optional<BigNumber>) => value && isGreaterThanZero(value);
