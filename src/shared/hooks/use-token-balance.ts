import { useEffect } from 'react';

import { Token } from '@shared/types';

import { useTokensBalancesStore } from './use-tokens-balances-store';

export const useTokenBalance = (token: Token) => {
  const tokensBalancesStore = useTokensBalancesStore();

  useEffect(() => {
    const subscription = tokensBalancesStore.subscribe(token);

    return () => {
      tokensBalancesStore.unsubscribe(token, subscription);
    };
  }, [token, tokensBalancesStore]);

  return tokensBalancesStore.getBalance(token);
};
