import { useEffect, useState } from 'react';

import { BigNumber } from 'bignumber.js';

import { getTokenSlug, isExist, toArray } from '@shared/helpers';
import { Nullable, Optional, Token } from '@shared/types';

import { useAuthStore } from './use-auth-store';
import { useTokensBalancesStore } from './use-tokens-balances-store';

export interface BalanceToken {
  balance: Optional<BigNumber>;
  token: Token;
}

const uniqSlugs = (tokens: Optional<Array<Token>>) => {
  return tokens?.reduce((acc, token) => {
    return acc + getTokenSlug(token);
  }, '');
};

export const useTokensWithBalances = (tokens: Optional<Array<Token>>): Array<BalanceToken> => {
  const tokensBalancesStore = useTokensBalancesStore();
  const { accountPkh } = useAuthStore();
  const [wrapTokens, setWrapTokens] = useState<Nullable<Array<Token>>>(null);

  useEffect(() => {
    const cleanTokens = toArray(tokens).filter(Boolean);
    setWrapTokens(cleanTokens);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uniqSlugs(tokens)]);

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
  }, [wrapTokens, tokensBalancesStore, accountPkh]);

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
