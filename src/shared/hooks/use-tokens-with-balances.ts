import { useEffect, useState } from 'react';

import { BigNumber } from 'bignumber.js';

import { isExist, toArray } from '@shared/helpers';
import { Optional, Token } from '@shared/types';

import { useTokensBalancesStore } from './use-tokens-balances-store';

export interface BalanceToken {
  balance: Optional<BigNumber>;
  token: Token;
}

export const useTokensWithBalances = (tokens: Optional<Array<Token>>): Array<BalanceToken> => {
  const tokensBalancesStore = useTokensBalancesStore();
  const [wrapTokens, setWrapTokens] = useState<Nullable<Array<Token>>>(null);

  useEffect(() => {
    const cleanTokens = toArray(tokens).filter(Boolean) as Array<Token>;
    setWrapTokens(cleanTokens);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExist(tokens)]);

  useEffect(() => {
    if (isExist(wrapTokens)) {
      const subscriptionList = wrapTokens.map(token => {
        const subscription = tokensBalancesStore.subscribe(token);

        void tokensBalancesStore.loadTokenBalance(token);

        return {
          token,
          subscription
        };
      });

      return () => {
        subscriptionList.forEach(({ token, subscription }) => tokensBalancesStore.unsubscribe(token, subscription));
      };
    }
  }, [wrapTokens, tokensBalancesStore]);

  if (isExist(wrapTokens)) {
    return wrapTokens.map(token => {
      const balance = tokensBalancesStore.getBalance(token);

      return {
        balance,
        token
      };
    });
  }

  return [];
};
