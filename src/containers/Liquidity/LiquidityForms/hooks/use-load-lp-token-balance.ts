import { useEffect, useState } from 'react';

import { FoundDex } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';

import { loadUserLpBalance } from '@containers/Liquidity/LiquidityForms/blockchain/getters/load-user-lp-balance-tokens';
import { useAccountPkh, useTezos } from '@utils/dapp';
import { Nullable, WhitelistedToken } from '@utils/types';

export const useLoadLpTokenBalance = (dex: FoundDex, tokenA: WhitelistedToken, tokenB: WhitelistedToken) => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();

  const [lpTokenBalance, setLpTokenBalance] = useState<Nullable<BigNumber>>(null);

  // eslint-disable-next-line sonarjs/cognitive-complexity
  useEffect(() => {
    let isMounted = true;
    const getLpTokenBalance = async () => {
      if (!tezos || !accountPkh) {
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tezos, accountPkh, dex]);

  return lpTokenBalance;
};
