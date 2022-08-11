import { BigNumber } from 'bignumber.js';

import { EMPTY_STRING } from '@config/constants';

export const getNotNullFixedValue = (value: Nullable<BigNumber>) => value ?? EMPTY_STRING;
