import BigNumber from 'bignumber.js';

import { EMPTY_STRING } from '@config/constants';

import { Optional } from '../../types';
import { isExist } from '../type-checks';

export const toFixed = (value: Optional<BigNumber>): string =>
  isExist(value) && !value.isNaN() ? value.toFixed() : EMPTY_STRING;
