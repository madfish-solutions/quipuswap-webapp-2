import BigNumber from 'bignumber.js';

import { isNull } from '@shared/helpers';

export const calculateOutputWithToken = (
  lpValue: Nullable<BigNumber>,
  totalLpSupply: BigNumber,
  outReserve: BigNumber
) => {
  if (isNull(lpValue)) {
    return null;
  }

  return lpValue.multipliedBy(outReserve).dividedBy(totalLpSupply);
};
