import { useCallback, useEffect, useState } from 'react';

import { FoundDex } from '@quipuswap/sdk';

import { TOKEN_TO_TOKEN_DEX } from '@app.config';
import { isNull, isUndefined } from '@utils/helpers';
import { Nullable, Optional, WhitelistedToken } from '@utils/types';

import { PairInfo } from '../add-liquidity-form';
import { loadTokenToTokenPairInfo } from '../blockchain';
import { getTezTokenPairInfo } from '../helpers';

export const usePairInfo = (
  dex: Optional<FoundDex>,
  tokenA: Nullable<WhitelistedToken>,
  tokenB: Nullable<WhitelistedToken>
) => {
  const [pairInfo, setPairInfo] = useState<Optional<PairInfo>>(undefined);

  const loadPairInfo = useCallback(
    async (dex: Optional<FoundDex>, tokenA: Nullable<WhitelistedToken>, tokenB: Nullable<WhitelistedToken>) => {
      if (isUndefined(dex)) {
        setPairInfo(undefined);
      } else if (isNull(dex) || isNull(tokenA) || isNull(tokenB)) {
        setPairInfo(null);
      } else {
        const newPairInfo =
          dex.contract.address === TOKEN_TO_TOKEN_DEX
            ? await loadTokenToTokenPairInfo(dex, tokenA, tokenB)
            : getTezTokenPairInfo(dex, tokenA, tokenB);

        setPairInfo(newPairInfo);
      }
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
