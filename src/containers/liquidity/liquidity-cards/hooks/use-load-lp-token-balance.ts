import { useEffect, useState } from 'react';

import { FoundDex } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';

import { useAccountPkh, useTezos } from '@utils/dapp';
import { Nullable, Token } from '@utils/types';

import { loadUserLpBalance } from '../blockchain/getters/load-user-lp-balance-tokens';

export const useLoadLpTokenBalance = (dex: Nullable<FoundDex>, tokenA: Nullable<Token>, tokenB: Nullable<Token>) => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();

  const [lpTokenBalance, setLpTokenBalance] = useState<Nullable<BigNumber>>(null);

  useEffect(() => {
    let isMounted = true;
    const getLpTokenBalance = async () => {
      if (!tezos || !accountPkh || !dex || !tokenA || !tokenB) {
        setLpTokenBalance(null);

        return;
      }

      const userLpTokenBalance = await loadUserLpBalance(tezos, accountPkh, dex, tokenA, tokenB);

      if (isMounted) {
        setLpTokenBalance(userLpTokenBalance);
      }
    };

    void getLpTokenBalance();

    return () => {
      isMounted = false;
    };
  }, [tezos, accountPkh, dex, tokenA, tokenB]);

  return lpTokenBalance;
};
