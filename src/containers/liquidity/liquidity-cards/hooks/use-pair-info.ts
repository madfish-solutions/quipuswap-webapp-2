import { useCallback, useEffect, useState } from 'react';

import { FoundDex } from '@quipuswap/sdk';

import { TOKEN_TO_TOKEN_DEX } from '@app.config';
import { Nullable, Token } from '@utils/types';

import { PairInfo } from '../add-liquidity-form';
import { loadTokenToTokenPairInfo } from '../blockchain';
import { getTezTokenPairInfo } from '../helpers';

export const usePairInfo = (dex: Nullable<FoundDex>, tokenA: Nullable<Token>, tokenB: Nullable<Token>) => {
  const [pairInfo, setPairInfo] = useState<Nullable<PairInfo>>(null);

  const loadPairInfo = useCallback(
    async (dex: Nullable<FoundDex>, tokenA: Nullable<Token>, tokenB: Nullable<Token>) => {
      if (!dex || !tokenA || !tokenB) {
        setPairInfo(null);

        return;
      }
      const newPairInfo =
        dex.contract.address === TOKEN_TO_TOKEN_DEX
          ? await loadTokenToTokenPairInfo(dex, tokenA, tokenB)
          : getTezTokenPairInfo(dex, tokenA, tokenB);

      setPairInfo(newPairInfo);
    },
    []
  );

  useEffect(() => {
    void loadPairInfo(dex, tokenA, tokenB);
    // Waiting for DEX changing because it is loading asynchronously
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dex]);

  return { pairInfo, updatePairInfo: loadPairInfo };
};
