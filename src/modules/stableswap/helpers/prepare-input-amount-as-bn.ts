import { BigNumber } from 'bignumber.js';

import { prepareNumberAsString } from '@shared/helpers';

export const prepareInputAmountAsBN = (inputAmount: string): Nullable<BigNumber> => {
  const preparedTokenInput = prepareNumberAsString(inputAmount);

  const tokenInputBN = new BigNumber(preparedTokenInput);

  return tokenInputBN.isNaN() ? null : tokenInputBN;
};
