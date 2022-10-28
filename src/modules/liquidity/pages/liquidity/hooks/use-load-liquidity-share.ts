import { useCallback, useEffect, useState } from 'react';

import { FoundDex } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';

import { useTezos, useAccountPkh } from '@providers/use-dapp';
import { Nullable, Optional, Token } from '@shared/types';

import { loadUserLiquidiytShares } from '../liquidity-cards/blockchain/getters';

export interface LiquidityShareResult {
  unfrozen: BigNumber;
  frozen: BigNumber;
  total: BigNumber;
}

export const useLoadLiquidityShare = (dex: Optional<FoundDex>, tokenA: Nullable<Token>, tokenB: Nullable<Token>) => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();

  const [share, setShare] = useState<Nullable<LiquidityShareResult>>(null);

  const loadShare = useCallback(
    async (_dex: Optional<FoundDex>, _tokenA: Nullable<Token>, _tokenB: Nullable<Token>) => {
      if (!tezos || !accountPkh || !_dex || !_tokenA || !_tokenB) {
        return;
      }

      const userLiquidityShares = await loadUserLiquidiytShares(tezos, accountPkh, _dex, _tokenA, _tokenB);

      setShare(userLiquidityShares);
    },
    [tezos, accountPkh]
  );

  const clearShares = useCallback(() => setShare(null), []);

  useEffect(() => {
    void loadShare(dex, tokenA, tokenB);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tezos, accountPkh, dex, tokenA, tokenB]);

  return { share, updateLiquidityShares: loadShare, clearShares };
};
