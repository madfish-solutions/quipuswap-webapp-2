import { useCallback, useEffect, useMemo } from 'react';

import { Optional, Token } from '@shared/types';

import { useAuthStore } from './use-auth-store';
import { useTokensBalancesStore } from './use-tokens-balances-store';

export const useTokenBalance = (token: Optional<Token>) => {
  const tokensBalancesStore = useTokensBalancesStore();
  const { accountPkh } = useAuthStore();

  useEffect(() => {
    if (!token) {
      return;
    }
    const subscription = tokensBalancesStore.subscribe(token);

    return () => {
      tokensBalancesStore.unsubscribe(token, subscription);
    };
  }, [token, tokensBalancesStore, accountPkh]);

  const load = useCallback(async () => tokensBalancesStore.loadTokenBalance(token), [token, tokensBalancesStore]);
  const amount = useMemo(() => tokensBalancesStore.getBalance(token), [token, tokensBalancesStore]);

  return { load, amount };
};
