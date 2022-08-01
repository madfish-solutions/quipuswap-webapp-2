import { useEffect, useState } from 'react';

import { FoundDex } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';

import { useTezos, useAccountPkh } from '@providers/use-dapp';
import { Nullable, Optional, Token } from '@shared/types';

import { loadRealUserLpBalance } from '../blockchain/getters';

export const useLoadLpTokenBalance = (dex: Optional<FoundDex>, tokenA: Nullable<Token>, tokenB: Nullable<Token>) => {
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

      const realUserLpTokenBalance = await loadRealUserLpBalance(tezos, accountPkh, dex, tokenA, tokenB);

      if (isMounted) {
        setLpTokenBalance(realUserLpTokenBalance);
      }
    };

    void getLpTokenBalance();

    return () => {
      isMounted = false;
    };
  }, [tezos, accountPkh, dex, tokenA, tokenB]);

  return lpTokenBalance;
};
