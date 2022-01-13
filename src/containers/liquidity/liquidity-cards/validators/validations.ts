import BigNumber from 'bignumber.js';

import { validateInputtedDecimals } from '@containers/liquidity/liquidity-cards/validators/validate-inputted-decimals';
import { Nullable } from '@utils/types';

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
