import { useState, useEffect } from 'react';

import { getUserBalance, useAccountPkh, useTezos } from '@utils/dapp';
import { fromDecimals } from '@utils/helpers';
import { Nullable, WhitelistedToken } from '@utils/types';

export const useLoadTokenBalance = (token: Nullable<WhitelistedToken>) => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();

  const [tokenBalance, setTokenBalance] = useState<string>('0');

  useEffect(() => {
    let isMounted = true;
    const getTokenBalance = async () => {
      if (!tezos || !accountPkh || !token) {
        return;
      }

      const { contractAddress, type, fa2TokenId, metadata } = token;
      const { decimals } = metadata;

      const userTokenABalance = await getUserBalance(tezos, accountPkh, contractAddress, type, fa2TokenId);

      if (userTokenABalance && isMounted) {
        setTokenBalance(fromDecimals(userTokenABalance, decimals).toFixed(decimals));
      } else if (!userTokenABalance && isMounted) {
        setTokenBalance('0');
      }
    };
    void getTokenBalance();

    return () => {
      isMounted = false;
    };
  }, [tezos, accountPkh, token]);

  return tokenBalance;
};
