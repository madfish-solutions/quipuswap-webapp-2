import { useCallback, useEffect, useState } from 'react';

import BigNumber from 'bignumber.js';

import { getUserBalance, useAccountPkh, useTezos } from '@utils/dapp';
import { fromDecimals } from '@utils/helpers';
import { Nullable, WhitelistedToken } from '@utils/types';

export const useLoadTokenBalance = (token: Nullable<WhitelistedToken>) => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();

  const [tokenBalance, setTokenBalance] = useState<Nullable<BigNumber>>(null);

  const getTokenBalance = useCallback(
    async (token: Nullable<WhitelistedToken>) => {
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

  useEffect(() => {
    void getTokenBalance(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tezos, accountPkh, token]);

  return { tokenBalance, updateTokenBalance: getTokenBalance };
};
