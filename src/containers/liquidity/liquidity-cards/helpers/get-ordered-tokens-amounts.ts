import BigNumber from 'bignumber.js';

import { WhitelistedToken } from '@utils/types';

import { sortTokensContracts } from './sort-tokens-contracts';

export const getOrderedTokensAmounts = (
  tokenA: WhitelistedToken,
  tokenB: WhitelistedToken,
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
