import BigNumber from 'bignumber.js';

import { getTokenInputAmountCap } from '@utils/helpers';
import { Optional, Token } from '@utils/types';

const EMPTY_BALANCE_AMOUNT = 0;

export const getUserMaxInputAmount = (
  inputToken: Token,
  balance: Optional<BigNumber>,
  maxInputAmount: Optional<BigNumber>
) => {
  const inputTokenCap = getTokenInputAmountCap(inputToken);
  const max = BigNumber.minimum(
    BigNumber.maximum(EMPTY_BALANCE_AMOUNT, balance?.minus(inputTokenCap) ?? Infinity),
    maxInputAmount ?? Infinity
  );
  if (!max.isFinite()) {
    return null;
  }

  return max;
};
