import { useEffect, useState } from 'react';

import { FoundDex, getLiquidityShare } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';

import { LP_TOKEN_DECIMALS } from '@app.config';
import { useAccountPkh, useTezos } from '@utils/dapp';
import { fromDecimals } from '@utils/helpers';
import { Nullable } from '@utils/types';

interface LiquidityShareResult {
  unfrozen: BigNumber;
  frozen: BigNumber;
  total: BigNumber;
}

export const useLoadLiquidityShare = (dex: FoundDex) => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();

  const [share, setShare] = useState<Nullable<LiquidityShareResult>>(null);

  useEffect(() => {
    const loadShare = async () => {
      if (tezos && accountPkh && dex) {
        const { unfrozen, frozen, total } = await getLiquidityShare(tezos, dex, accountPkh);
        setShare({
          unfrozen: fromDecimals(unfrozen, LP_TOKEN_DECIMALS),
          frozen: fromDecimals(frozen, LP_TOKEN_DECIMALS),
          total: fromDecimals(total, LP_TOKEN_DECIMALS)
        });
      }
    };
    void loadShare();
  }, [tezos, accountPkh, dex]);

  return share;
};
