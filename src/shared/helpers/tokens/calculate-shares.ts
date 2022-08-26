import BigNumber from 'bignumber.js';

import { isNull } from '@shared/helpers';

export const calculateShares = (
  inputAmount: Nullable<BigNumber>,
  reserve: BigNumber,
  totalLpSupply: BigNumber
): Nullable<BigNumber> => (isNull(inputAmount) ? null : inputAmount.multipliedBy(totalLpSupply).dividedBy(reserve));
