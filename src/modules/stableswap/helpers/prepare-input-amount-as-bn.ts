import { BigNumber } from 'bignumber.js';

import { prepareNumberAsString } from '@shared/helpers';

export const prepareInputAmountAsBN = (inputAmount: string) => {
  const preparedTokenInput = prepareNumberAsString(inputAmount);

  return new BigNumber(preparedTokenInput);
};
