import { useEffect } from 'react';

import { BigNumber } from 'bignumber.js';

import { Optional, Token } from '@shared/types';

import { useTokensBalancesStore } from './use-tokens-balances-store';

export const useTokenBalance = (token: Optional<Token>): Optional<BigNumber> => {
  const tokensBalancesStore = useTokensBalancesStore();

  useEffect(() => {
    if (token) {
      const subscription = tokensBalancesStore.subscribe(token);

      void tokensBalancesStore.loadTokenBalance(token);

      return () => {
        tokensBalancesStore.unsubscribe(token, subscription);
      };
    }
  }, [token, tokensBalancesStore]);

  return tokensBalancesStore.getBalance(token);
};
