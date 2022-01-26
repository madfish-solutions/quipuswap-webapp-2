import BigNumber from 'bignumber.js';

const DEFAULT_INT_DECIMALS = 0;
const DEFAULT_DECIMALS = 2;

export interface FormatNumberOptions {
  decimals?: number;
}

const DEFAULT_FMT = {
  prefix: '',
  decimalSeparator: '.',
  groupSeparator: ',',
  groupSize: 3,
  secondaryGroupSize: 3
};

export const FormatNumber = (value: BigNumber.Value, options?: FormatNumberOptions): string => {
  const bn = new BigNumber(value);

  const autoDecimals = bn.isInteger() ? DEFAULT_INT_DECIMALS : DEFAULT_DECIMALS;
  const decimals = options?.decimals || autoDecimals;

  return bn.toFormat(decimals, BigNumber.ROUND_UP, DEFAULT_FMT);
};
