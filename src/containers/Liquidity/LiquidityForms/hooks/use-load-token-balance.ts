import { useState, useEffect } from 'react';

import BigNumber from 'bignumber.js';

import { getUserBalance, useAccountPkh, useTezos } from '@utils/dapp';
import { Nullable, WhitelistedToken } from '@utils/types';

const DEFAULT_BALANCE = 0;

export const useLoadTokenBalance = (token: Nullable<WhitelistedToken>) => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();

  const [tokenBalance, setTokenBalance] = useState<BigNumber>(new BigNumber(DEFAULT_BALANCE));

  useEffect(() => {
    let isMounted = true;
    const getTokenBalance = async () => {
      if (!tezos || !accountPkh || !token) {
        return;
      }

      const { contractAddress, type, fa2TokenId } = token;

      const userTokenABalance = await getUserBalance(tezos, accountPkh, contractAddress, type, fa2TokenId);

      if (userTokenABalance && isMounted) {
        setTokenBalance(userTokenABalance);
      }
    };
    void getTokenBalance();

    return () => {
      isMounted = false;
    };
  }, [tezos, accountPkh, token]);

  return tokenBalance;
};
