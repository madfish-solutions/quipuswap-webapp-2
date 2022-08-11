import BigNumber from 'bignumber.js';

import { isExist } from '@shared/helpers';
import { Optional, Token } from '@shared/types';

export const calculateOutputWithToken = (
  shares: Optional<BigNumber>,
  totalLpSupply: BigNumber,
  outReserve: BigNumber,
  token: Token
) => {
  if (!isExist(shares)) {
    return null;
  }

  return shares
    .multipliedBy(outReserve)
    .dividedBy(totalLpSupply)
    .decimalPlaces(token.metadata.decimals, BigNumber.ROUND_DOWN);
};
