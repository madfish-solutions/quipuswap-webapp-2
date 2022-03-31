import { useCallback, useEffect, useState } from 'react';

import BigNumber from 'bignumber.js';
import constate from 'constate';

import { getUserBalance } from '@api/get-user-balance';
import { useAccountPkh, useTezos } from '@utils/dapp';
import { defined, fromDecimals, getTokenSlug } from '@utils/helpers';
import { Token } from '@utils/types';

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
