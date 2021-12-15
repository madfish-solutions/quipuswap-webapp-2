import { useState } from 'react';

import BigNumber from 'bignumber.js';

import { useDexGraph } from '@hooks/useDexGraph';
import { fromDecimals, getMaxTokenInput, getTokenOutput, getTokenSlug } from '@utils/helpers';
import { getMaxInputRoute, getMaxOutputRoute } from '@utils/routing';
import { WhitelistedToken } from '@utils/types';

export const useSwapLimits = () => {
  const { dexGraph } = useDexGraph();

  const [maxInputAmounts, setMaxInputAmounts] = useState<Record<string, Record<string, BigNumber>>>({});
  const [maxOutputAmounts, setMaxOutputAmounts] = useState<Record<string, Record<string, BigNumber>>>({});

  const updateMaxInputAmount = (token1: WhitelistedToken, token2: WhitelistedToken, amount: BigNumber) => {
    setMaxInputAmounts(prevValue => {
      const token1Slug = getTokenSlug(token1);
      const token2Slug = getTokenSlug(token2);

      return {
        ...prevValue,
        [token1Slug]: {
          ...(prevValue[token1Slug] ?? {}),
          [token2Slug]: amount
        }
      };
    });
  };

  const updateMaxOutputAmount = (token1: WhitelistedToken, token2: WhitelistedToken, amount: BigNumber) => {
    // eslint-disable-next-line sonarjs/no-identical-functions
    setMaxOutputAmounts(prevValue => {
      const token1Slug = getTokenSlug(token1);
      const token2Slug = getTokenSlug(token2);

      return {
        ...prevValue,
        [token1Slug]: {
          ...(prevValue[token1Slug] ?? {}),
          [token2Slug]: amount
        }
      };
    });
  };

  const updateSwapLimits = (token1: WhitelistedToken, token2: WhitelistedToken) => {
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
      console.error(e);
    }
  };

  return { maxInputAmounts, maxOutputAmounts, updateSwapLimits };
};
