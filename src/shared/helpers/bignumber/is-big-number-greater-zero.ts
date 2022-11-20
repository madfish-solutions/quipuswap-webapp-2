import { BigNumber } from 'bignumber.js';

import { Nullable } from '../../types';

export const isBigNumberGreaterZero = (amount: Nullable<BigNumber>): amount is BigNumber => !!amount && amount.gt('0');
