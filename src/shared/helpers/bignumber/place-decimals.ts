import BigNumber from 'bignumber.js';

import { Token } from '@shared/types';

export const placeDecimals = (
  amount: BigNumber,
  decimalsOrToken: number | Token,
  roundingMode: BigNumber.RoundingMode = BigNumber.ROUND_DOWN
) => {
  const decimals = typeof decimalsOrToken === 'number' ? decimalsOrToken : decimalsOrToken.metadata.decimals;

  return amount.decimalPlaces(decimals, roundingMode);
};
