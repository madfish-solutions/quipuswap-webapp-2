import BigNumber from 'bignumber.js';

export const stringToBigNumber = (value: string): BigNumber => new BigNumber(value.replaceAll(',', '.'));
