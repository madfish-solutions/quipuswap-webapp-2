import BigNumber from 'bignumber.js';

import { Nullable } from '@utils/types';

import { validateUserInput } from './validate-user-input';
import { validateUserInputAmount } from './validate-user-input-amount';

export const validations = (accountPkh: Nullable<string>, tokenAmount: BigNumber, userBalance: Nullable<BigNumber>) => {
  return validateUserInput(tokenAmount.toFixed()) || validateUserInputAmount(accountPkh, tokenAmount, userBalance);
};
