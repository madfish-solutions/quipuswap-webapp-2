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
    const getTokenABalance = async () => {
      if (!tezos || !accountPkh || !token) {
        return;
      }

      const userTokenABalance = await getUserBalance(
        tezos,
        accountPkh,
        token.contractAddress,
        token.type,
        token.fa2TokenId
      );

      if (userTokenABalance && isMounted) {
        setTokenBalance(fromDecimals(userTokenABalance, token.metadata.decimals).toFixed(token.metadata.decimals));
      } else if (!userTokenABalance && isMounted) {
        setTokenBalance('0');
      }
    };
    void getTokenABalance();

    return () => {
      isMounted = false;
    };
  }, [tezos, accountPkh, token]);

  return tokenBalance;
};
