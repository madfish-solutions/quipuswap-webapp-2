import { useEffect, useState } from 'react';

import BigNumber from 'bignumber.js';
import constate from 'constate';

import { getUserBalance, useAccountPkh, useTezos } from '@utils/dapp';
import { fromDecimals, getTokenSlug } from '@utils/helpers';
import { WhitelistedToken } from '@utils/types';

export const [BalancesProvider, useBalances] = constate(() => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();

  const [balances, setBalances] = useState<Record<string, BigNumber>>({});

  useEffect(() => setBalances({}), [accountPkh]);

  const updateBalance = async (token: WhitelistedToken) => {
    if (accountPkh) {
      const balance = await getUserBalance(tezos!, accountPkh, token.contractAddress, token.type, token.fa2TokenId);

      setBalances(prevValue => ({
        ...prevValue,
        [getTokenSlug(token)]: fromDecimals(balance ?? new BigNumber(0), token.metadata.decimals)
      }));
    }
  };

  return { balances, updateBalance };
});
