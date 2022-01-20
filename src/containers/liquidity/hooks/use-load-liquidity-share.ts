import { useEffect, useState } from 'react';

import { FoundDex } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';

import { useAccountPkh, useTezos } from '@utils/dapp';
import { Nullable, WhitelistedToken } from '@utils/types';

import { loadUserLiquidiytShares } from '../liquidity-cards/blockchain/getters/load-user-liquidity-shares';

export interface LiquidityShareResult {
  unfrozen: BigNumber;
  frozen: BigNumber;
  total: BigNumber;
}

export const useLoadLiquidityShare = (
  dex: Nullable<FoundDex>,
  tokenA: Nullable<WhitelistedToken>,
  tokenB: Nullable<WhitelistedToken>
) => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();

  const [share, setShare] = useState<Nullable<LiquidityShareResult>>(null);

  const loadShare = async (
    dex: Nullable<FoundDex>,
    tokenA: Nullable<WhitelistedToken>,
    tokenB: Nullable<WhitelistedToken>
  ) => {
    if (!tezos || !accountPkh || !dex || !tokenA || !tokenB) {
      return;
    }

    const userLiquidityShares = await loadUserLiquidiytShares(tezos, accountPkh, dex, tokenA, tokenB);

    setShare(userLiquidityShares);
  };

  useEffect(() => {
    void loadShare(dex, tokenA, tokenB);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tezos, accountPkh, dex, tokenA, tokenB]);

  return { share, updateLiquidityShares: loadShare };
};
