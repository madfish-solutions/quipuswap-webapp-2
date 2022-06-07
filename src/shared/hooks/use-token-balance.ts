import { useEffect } from 'react';

import { BigNumber } from 'bignumber.js';

import { Optional, Token } from '@shared/types';

import { useAuthStore } from './use-auth-store';
import { useTokensBalancesStore } from './use-tokens-balances-store';

export const useTokenBalance = (token: Optional<Token>): Optional<BigNumber> => {
  const tokensBalancesStore = useTokensBalancesStore();
  const { accountPkh } = useAuthStore();

  useEffect(() => {
    if (token) {
      const subscription = tokensBalancesStore.subscribe(token);

      void tokensBalancesStore.loadTokenBalance(token);

      return () => {
        tokensBalancesStore.unsubscribe(token, subscription);
      };
    }
  }, [token, tokensBalancesStore, accountPkh]);

  return tokensBalancesStore.getBalance(token);
};
