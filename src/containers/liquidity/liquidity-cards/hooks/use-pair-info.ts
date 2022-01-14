import { useEffect, useState } from 'react';

import { FoundDex } from '@quipuswap/sdk';

import { TOKEN_TO_TOKEN_DEX } from '@app.config';
import { Nullable, WhitelistedToken } from '@utils/types';

import { PairInfo } from '../add-liquidity-form';
import { loadTokenToTokenPairInfo } from '../blockchain';
import { getTezTokenPairInfo } from '../helpers';

export const usePairInfo = (dex: FoundDex, tokenA: WhitelistedToken, tokenB: WhitelistedToken) => {
  const [pairInfo, setPairInfo] = useState<Nullable<PairInfo>>(null);

  useEffect(() => {
    const loadPairInfo = async () => {
      const newPairInfo =
        dex.contract.address === TOKEN_TO_TOKEN_DEX
          ? await loadTokenToTokenPairInfo(dex, tokenA, tokenB)
          : getTezTokenPairInfo(dex, tokenA, tokenB);

      setPairInfo(newPairInfo);
    };
    void loadPairInfo();
    // Waiting for DEX changing because it is loading asynchronously
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dex]);

  return pairInfo;
};
