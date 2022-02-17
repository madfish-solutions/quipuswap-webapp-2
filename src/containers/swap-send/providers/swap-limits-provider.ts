import { useState } from 'react';

import BigNumber from 'bignumber.js';
import constate from 'constate';

import { useDexGraph } from '@hooks/use-dex-graph';
import { RawToken } from '@interfaces/types';
import { fromDecimals, getMaxTokenInput, getTokenOutput, getTokenSlug } from '@utils/helpers';
import { getMaxInputRoute, getMaxOutputRoute } from '@utils/routing';

type TokensAmounts = Record<string, Record<string, BigNumber>>;

const updateTokensAmounts = (prevAmounts: TokensAmounts, token1: RawToken, token2: RawToken, amount: BigNumber) => ({
  ...prevAmounts,
  [getTokenSlug(token1)]: {
    ...(prevAmounts[getTokenSlug(token1)] ?? {}),
    [getTokenSlug(token2)]: amount
  }
});

export const [SwapLimitsProvider, useSwapLimits] = constate(() => {
  const { dexGraph } = useDexGraph();

  const [maxInputAmounts, setMaxInputAmounts] = useState<TokensAmounts>({});
  const [maxOutputAmounts, setMaxOutputAmounts] = useState<TokensAmounts>({});

  const updateMaxInputAmount = (token1: RawToken, token2: RawToken, amount: BigNumber) => {
    setMaxInputAmounts(prevValue => updateTokensAmounts(prevValue, token1, token2, amount));
  };

  const updateMaxOutputAmount = (token1: RawToken, token2: RawToken, amount: BigNumber) => {
    setMaxOutputAmounts(prevValue => updateTokensAmounts(prevValue, token1, token2, amount));
  };

  const updateSwapLimits = (token1: RawToken, token2: RawToken) => {
    const startTokenSlug = getTokenSlug(token1);
    const endTokenSlug = getTokenSlug(token2);
    try {
      const maxInputRoute = getMaxInputRoute({
        startTokenSlug,
        endTokenSlug,
        graph: dexGraph
      });
      if (maxInputRoute) {
        updateMaxInputAmount(token1, token2, fromDecimals(getMaxTokenInput(token2, maxInputRoute), token1));
      }
      const maxOutputRoute = getMaxOutputRoute({
        startTokenSlug,
        endTokenSlug,
        graph: dexGraph
      });
      if (maxOutputRoute) {
        const generalMaxInputAmount = getMaxTokenInput(token2, maxOutputRoute);
        updateMaxOutputAmount(
          token1,
          token2,
          fromDecimals(
            getTokenOutput({
              inputToken: token1,
              inputAmount: generalMaxInputAmount,
              dexChain: maxOutputRoute
            }),
            token2
          )
        );
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };

  return { maxInputAmounts, maxOutputAmounts, updateSwapLimits };
});
