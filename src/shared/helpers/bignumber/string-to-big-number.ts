import BigNumber from 'bignumber.js';

import { INFINITY_SIGN } from '@config/constants';

export const stringToBigNumber = (value: string): BigNumber =>
  new BigNumber(value.replaceAll(',', '.').replace(INFINITY_SIGN, Infinity.toString()));
