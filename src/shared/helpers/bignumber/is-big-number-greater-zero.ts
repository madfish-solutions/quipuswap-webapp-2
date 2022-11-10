import { BigNumber } from 'bignumber.js';

export const isBigNumberGreaterZero = (amount: Nullable<BigNumber>): amount is BigNumber => !!amount && amount.gt('0');
