import BigNumber from 'bignumber.js';

import { RawToken } from '@interfaces/types';

import { sortTokensContracts } from './sort-tokens-contracts';

export const getOrderedTokensAmounts = (
  tokenA: RawToken,
  tokenB: RawToken,
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
