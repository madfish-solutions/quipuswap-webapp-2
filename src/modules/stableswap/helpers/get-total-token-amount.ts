import { getSumOfNumbers, isTokenEqual } from '@shared/helpers';
import { AmountToken, Token } from '@shared/types';

export const getTotalTokenAmount = (tokensAndAmounts: Array<AmountToken>, token: Token) =>
  getSumOfNumbers(
    tokensAndAmounts.filter(({ token: currentToken }) => isTokenEqual(token, currentToken)).map(({ amount }) => amount)
  );
