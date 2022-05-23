import { useEffect } from 'react';

import { BigNumber } from 'bignumber.js';

import { isExist } from '@shared/helpers';
import { Optional, Token } from '@shared/types';

import { useTokensBalancesStore } from './use-tokens-balances-store';

export interface BalanceToken {
  balance: Optional<BigNumber>;
  token: Token;
}

export const useTokensBalances = (tokens: Optional<Array<Token>>): Array<BalanceToken> => {
  const tokensBalancesStore = useTokensBalancesStore();

  useEffect(() => {
    if (tokens) {
      const subscriptionList = tokens.map(token => {
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
  }, [tokens, tokensBalancesStore]);

  if (isExist(tokens)) {
    return tokens.map(token => {
      const balance = tokensBalancesStore.getBalance(token);

      return {
        balance,
        token
      };
    });
  }

  return [];
};
