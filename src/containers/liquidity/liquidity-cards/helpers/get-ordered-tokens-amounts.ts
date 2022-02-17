import BigNumber from 'bignumber.js';

import { Token } from '@utils/types';

import { sortTokensContracts } from './sort-tokens-contracts';

export const getOrderedTokensAmounts = (
  tokenA: Token,
  tokenB: Token,
  tokenAAmount: BigNumber,
  tokenBAmount: BigNumber
) => {
  const addresses = sortTokensContracts(tokenA, tokenB);

  const isTokenOrdersValid = !addresses.isRevert;

  return {
    orderedAmountA: isTokenOrdersValid ? tokenAAmount : tokenBAmount,
    orderedAmountB: isTokenOrdersValid ? tokenBAmount : tokenAAmount
  };
};
