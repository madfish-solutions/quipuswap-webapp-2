import { useEffect, useState } from 'react';

import { BigNumber } from 'bignumber.js';

import { useAccountPkh, useTezos } from '@providers/use-dapp';
import { getFirstElement, isExist, isSingleElement, toArray } from '@shared/helpers';
import { Optional, Token } from '@shared/types';

import { useTokensBalancesStore } from './use-tokens-balances-store';

type Tokens = Token | Array<Token>;

//TODO: remove tezos and accountPkh it`s already in store
//TODO: move list of balance logic to store
export function useTokenBalance(tokens: Optional<Token>): Optional<BigNumber>;
export function useTokenBalance(tokens: Optional<Array<Token>>): Array<{ balance: Optional<BigNumber>; token: Token }>;

export function useTokenBalance(tokens: Optional<Tokens>) {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();
  const tokensBalancesStore = useTokensBalancesStore();
  const [wrapTokens, setWrapTokens] = useState<Nullable<Array<Token>>>(null);

  useEffect(() => {
    const cleanTokens = toArray(tokens).filter(Boolean) as Array<Token>;
    setWrapTokens(cleanTokens);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExist(tokens)]);

  useEffect(() => {
    if (wrapTokens) {
      const subscriptionList = wrapTokens.map(token => {
        const subscription = tokensBalancesStore.subscribe(token);

        if (tezos && accountPkh) {
          void tokensBalancesStore.loadTokenBalance(tezos, accountPkh, token);
        }

        return {
          token,
          subscription
        };
      });

      return () => {
        subscriptionList.forEach(({ token, subscription }) => tokensBalancesStore.unsubscribe(token, subscription));
      };
    }
  }, [accountPkh, tezos, tokensBalancesStore, wrapTokens]);

  if (isExist(wrapTokens) && isSingleElement(wrapTokens)) {
    const token = getFirstElement(wrapTokens);

    return tokensBalancesStore.getBalance(token);
  }

  if (Array.isArray(wrapTokens)) {
    return wrapTokens.map(token => {
      const balance = tokensBalancesStore.getBalance(token);

      return {
        balance,
        token
      };
    });
  }

  return [];
}
