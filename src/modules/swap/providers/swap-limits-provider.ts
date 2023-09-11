import { useState } from 'react';

import { BigNumber } from 'bignumber.js';
import constate from 'constate';
import { getMaxInputRoute } from 'swap-router-sdk';

import { toReal, getTokenSlug } from '@shared/helpers';
import { Token } from '@shared/types';

import { useRoutePairs } from './route-pairs-provider';
import { getAllowedRoutePairsCombinations } from '../utils/swap-router-sdk-adapters';

type TokensAmounts = Record<string, Record<string, BigNumber>>;

const updateTokensAmounts = (prevAmounts: TokensAmounts, token1: Token, token2: Token, amount: BigNumber) => ({
  ...prevAmounts,
  [getTokenSlug(token1)]: {
    ...(prevAmounts[getTokenSlug(token1)] ?? {}),
    [getTokenSlug(token2)]: amount
  }
});

export const [SwapLimitsProvider, useSwapLimits] = constate(() => {
  const { routePairs, whitelistedPairs } = useRoutePairs();

  const [maxInputAmounts, setMaxInputAmounts] = useState<TokensAmounts>({});
  const [maxOutputAmounts, setMaxOutputAmounts] = useState<TokensAmounts>({});

  const updateMaxInputAmount = (token1: Token, token2: Token, amount: BigNumber) => {
    setMaxInputAmounts(prevValue => updateTokensAmounts(prevValue, token1, token2, amount));
  };

  const updateMaxOutputAmount = (token1: Token, token2: Token, amount: BigNumber) => {
    setMaxOutputAmounts(prevValue => updateTokensAmounts(prevValue, token1, token2, amount));
  };

  const updateSwapLimits = (token1: Token, token2: Token) => {
    try {
      const combinations = getAllowedRoutePairsCombinations(token1, token2, routePairs, whitelistedPairs);

      const { value: atomsMaxInputAmount } = getMaxInputRoute(combinations);
      updateMaxInputAmount(token1, token2, toReal(atomsMaxInputAmount, token1));
      updateMaxOutputAmount(token1, token2, new BigNumber(Infinity));
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };

  return { maxInputAmounts, maxOutputAmounts, updateSwapLimits };
});
