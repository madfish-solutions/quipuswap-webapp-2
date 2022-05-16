import { useEffect } from 'react';

import { useAccountPkh, useTezos } from '@providers/use-dapp';
import { Token } from '@shared/types';

import { useTokensBalancesStore } from './use-tokens-balances-store';

export const useTokenBalance = (token: Token) => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();
  const tokensBalancesStore = useTokensBalancesStore();

  useEffect(() => {
    const subscription = tokensBalancesStore.subscribe(token);

    if (tezos && accountPkh) {
      void tokensBalancesStore.loadTokenBalance(tezos, accountPkh, token);
    }

    return () => {
      tokensBalancesStore.unsubscribe(token, subscription);
    };
  }, [accountPkh, tezos, token, tokensBalancesStore]);

  return tokensBalancesStore.getBalance(token);
};
