import { useEffect, useState } from 'react';

import { FoundDex, getLiquidityShare } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';

import { LP_TOKEN_DECIMALS } from '@app.config';
import { isTezIncludes } from '@containers/liquidity/liquidity-cards/helpers';
import { useAccountPkh, useTezos } from '@utils/dapp';
import { fromDecimals } from '@utils/helpers';
import { Nullable, WhitelistedToken } from '@utils/types';

import { loadUserLpBalance } from '../liquidity-cards/blockchain/getters/load-user-lp-balance-tokens';

export interface LiquidityShareResult {
  unfrozen: BigNumber;
  frozen: BigNumber;
  total: BigNumber;
}

const ZERO_BALANCE = 0;

export const useLoadLiquidityShare = (
  dex: Nullable<FoundDex>,
  tokenA: Nullable<WhitelistedToken>,
  tokenB: Nullable<WhitelistedToken>
) => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();

  const [share, setShare] = useState<Nullable<LiquidityShareResult>>(null);

  useEffect(() => {
    const loadShare = async () => {
      if (!tezos || !accountPkh || !dex || !tokenA || !tokenB || !isTezIncludes([tokenA, tokenB])) {
        return;
      }
      if (isTezIncludes([tokenA, tokenB])) {
        const { unfrozen, frozen, total } = await getLiquidityShare(tezos, dex, accountPkh);
        setShare({
          unfrozen: fromDecimals(unfrozen, LP_TOKEN_DECIMALS),
          frozen: fromDecimals(frozen, LP_TOKEN_DECIMALS),
          total: fromDecimals(total, LP_TOKEN_DECIMALS)
        });
      } else {
        const userLpTokenBalance = await loadUserLpBalance(tezos, accountPkh, dex, tokenA, tokenB);
        if (!userLpTokenBalance) {
          return;
        }
        setShare({
          unfrozen: userLpTokenBalance,
          frozen: new BigNumber(ZERO_BALANCE),
          total: userLpTokenBalance
        });
      }
    };
    void loadShare();
  }, [tezos, accountPkh, dex, tokenA, tokenB]);

  return share;
};
