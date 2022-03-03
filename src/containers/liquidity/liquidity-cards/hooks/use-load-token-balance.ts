import { useCallback, useEffect, useState } from 'react';

import BigNumber from 'bignumber.js';

import { getUserBalance } from '@api/get-user-balance';
import { useAccountPkh, useTezos } from '@utils/dapp';
import { fromDecimals } from '@utils/helpers';
import { Nullable, Token } from '@utils/types';

export const useLoadTokenBalance = (token: Nullable<Token>) => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();

  const [tokenBalance, setTokenBalance] = useState<Nullable<BigNumber>>(null);

  const getTokenBalance = useCallback(
    async (token: Nullable<Token>) => {
      if (!tezos || !accountPkh || !token) {
        return;
      }

      const { contractAddress, type, fa2TokenId } = token;

      const userTokenABalance = await getUserBalance(tezos, accountPkh, contractAddress, type, fa2TokenId);

      if (userTokenABalance) {
        setTokenBalance(fromDecimals(userTokenABalance, token));
      }

      return userTokenABalance;
    },
    [accountPkh, tezos]
  );

  const clearBalance = useCallback(() => setTokenBalance(null), []);

  useEffect(() => {
    void getTokenBalance(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tezos, accountPkh, token]);

  return { tokenBalance, updateTokenBalance: getTokenBalance, clearBalance };
};
