import BigNumber from 'bignumber.js';

import { Nullable } from '@interfaces/types';

import { validateInputtedDecimals } from './validate-inputted-decimals';
import { validateUserInput } from './validate-user-input';
import { validateUserInputAmount } from './validate-user-input-amount';

export const validations = (
  accountPkh: Nullable<string>,
  tokenAmount: BigNumber,
  userBalance: Nullable<BigNumber>,
  userInput: string,
  decimals: number,
  tokenSymbol: string
) => {
  return (
    validateUserInput(tokenAmount.toFixed()) ||
    validateUserInputAmount(accountPkh, tokenAmount, userBalance) ||
    validateInputtedDecimals(userInput, decimals, tokenSymbol)
  );
};
