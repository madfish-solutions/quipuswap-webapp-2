import BigNumber from 'bignumber.js';

import { validateInputtedDecimals } from '@containers/Liquidity/LiquidityForms/validators/validate-inputted-decimals';
import { Nullable } from '@utils/types';

import { validateUserInput } from './validate-user-input';
import { validateUserInputAmount } from './validate-user-input-amount';

export const validations = (
  accountPkh: Nullable<string>,
  tokenAmount: BigNumber,
  userBalance: Nullable<BigNumber>,
  userInput: string,
  decimals: number
) => {
  return (
    validateUserInput(tokenAmount.toFixed()) ||
    validateUserInputAmount(accountPkh, tokenAmount, userBalance) ||
    validateInputtedDecimals(userInput, decimals)
  );
};
