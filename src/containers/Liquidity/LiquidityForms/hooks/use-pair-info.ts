import { useEffect, useState } from 'react';

import { FoundDex } from '@quipuswap/sdk';

import { PairInfo } from '@containers/Liquidity/LiquidityForms/add-liquidity-form/pair-info.interface';
import { loadTezTokenPairInfo } from '@containers/Liquidity/LiquidityForms/helpers/load-tez-token-pair-info';
import { loadTokenToTokenPairInfo } from '@containers/Liquidity/LiquidityForms/helpers/load-token-to-token-pair-info';
import { TOKEN_TO_TOKEN_DEX } from '@utils/defaults';
import { Nullable, WhitelistedToken } from '@utils/types';

export const usePairInfo = (dex: FoundDex, tokenA: WhitelistedToken, tokenB: WhitelistedToken) => {
  const [pairInfo, setPairInfo] = useState<Nullable<PairInfo>>(null);

  useEffect(() => {
    const loadPairInfo = async () => {
      const newPairInfo =
        dex.contract.address === TOKEN_TO_TOKEN_DEX
          ? await loadTokenToTokenPairInfo(dex, tokenA, tokenB)
          : loadTezTokenPairInfo(dex, tokenA, tokenB);

      setPairInfo(newPairInfo);
    };
    void loadPairInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dex]);

  return pairInfo;
};
