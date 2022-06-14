import BigNumber from 'bignumber.js';

import { isNull } from '@shared/helpers';
import { Token } from '@shared/types';

export const calculateOutputWithToken = (
  shares: Nullable<BigNumber>,
  totalLpSupply: BigNumber,
  outReserve: BigNumber,
  token: Token
) => {
  if (isNull(shares)) {
    return null;
  }

  return shares
    .multipliedBy(outReserve)
    .dividedBy(totalLpSupply)
    .decimalPlaces(token.metadata.decimals, BigNumber.ROUND_DOWN);
};
