import BigNumber from 'bignumber.js';

import { isNull } from '@shared/helpers';

export const calculateLpValue = (
  inputAmount: Nullable<BigNumber>,
  reserve: BigNumber,
  totalLpSupply: BigNumber
): Nullable<BigNumber> => (isNull(inputAmount) ? null : inputAmount.multipliedBy(totalLpSupply).dividedBy(reserve));
