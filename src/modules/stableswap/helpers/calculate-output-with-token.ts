import BigNumber from 'bignumber.js';

import { isNull } from '@shared/helpers';
import { Token } from '@shared/types';

export const calculateOutputWithToken = (
  lpValue: Nullable<BigNumber>,
  totalLpSupply: BigNumber,
  outReserve: BigNumber,
  token: Token
) => {
  if (isNull(lpValue)) {
    return null;
  }

  return lpValue
    .multipliedBy(outReserve)
    .dividedBy(totalLpSupply)
    .decimalPlaces(token.metadata.decimals, BigNumber.ROUND_DOWN);
};
