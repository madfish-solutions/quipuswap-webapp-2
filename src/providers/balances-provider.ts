import { useCallback, useEffect, useState } from 'react';

import BigNumber from 'bignumber.js';
import constate from 'constate';

import { getUserBalance } from '../api/get-user-balance';
import { useAccountPkh, useTezos } from '../providers/use-dapp';
import { getTokenSlug } from '../shared/helpers/get-token-slug';
import { fromDecimals } from '../shared/helpers/from-decimals';
import { defined } from '../shared/helpers/type-checks';
import { Token } from '../types';

export const [BalancesProvider, useBalances] = constate(() => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();

  const [balances, setBalances] = useState<Record<string, BigNumber>>({});

  useEffect(() => setBalances({}), [accountPkh]);

  const updateBalance = useCallback(
    async (token: Token) => {
      if (accountPkh) {
        const balance = await getUserBalance(
          defined(tezos),
          accountPkh,
          token.contractAddress,
          token.type,
          token.fa2TokenId
        );

        if (balance) {
          setBalances(prevValue => ({
            ...prevValue,
            [getTokenSlug(token)]: fromDecimals(balance, token.metadata.decimals)
          }));
        }
      }
    },
    [accountPkh, tezos]
  );

  return { balances, updateBalance };
});
