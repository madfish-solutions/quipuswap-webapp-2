import { useCallback, useEffect, useState } from 'react';

import { FoundDex } from '@quipuswap/sdk';

import { TOKEN_TO_TOKEN_DEX } from '@app.config';
import { isNull, isUndefined } from '@utils/helpers';
import { Nullable, Optional, Token } from '@utils/types';

import { PairInfo } from '../add-liquidity-form';
import { loadTokenToTokenPairInfo } from '../blockchain';
import { checkIsPoolNotExists, getTezTokenPairInfo } from '../helpers';

export const usePairInfo = (dex: Optional<FoundDex>, tokenA: Nullable<Token>, tokenB: Nullable<Token>) => {
  const [pairInfo, setPairInfo] = useState<Optional<PairInfo>>(undefined);

  const getPairInfo = useCallback(async (dex: Optional<FoundDex>, tokenA: Nullable<Token>, tokenB: Nullable<Token>) => {
    if (isUndefined(dex)) {
      return undefined;
    }

    if (isNull(dex) || isNull(tokenA) || isNull(tokenB)) {
      return null;
    }

    return dex.contract.address === TOKEN_TO_TOKEN_DEX
      ? await loadTokenToTokenPairInfo(dex, tokenA, tokenB)
      : getTezTokenPairInfo(dex, tokenA, tokenB);
  }, []);

  const loadPairInfo = async (dex: Optional<FoundDex>, tokenA: Nullable<Token>, tokenB: Nullable<Token>) =>
    setPairInfo(await getPairInfo(dex, tokenA, tokenB));

  useEffect(() => {
    void loadPairInfo(dex, tokenA, tokenB);
    // Waiting for DEX changing because it is loading asynchronously
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dex]);

  const isTokensOrderValid =
    tokenA?.contractAddress === pairInfo?.tokenA.contractAddress && tokenA?.fa2TokenId === pairInfo?.tokenA.fa2TokenId;

  const tokenAPool = isTokensOrderValid ? pairInfo?.tokenAPool ?? null : pairInfo?.tokenBPool ?? null;
  const tokenBPool = isTokensOrderValid ? pairInfo?.tokenBPool ?? null : pairInfo?.tokenAPool ?? null;

  const isPoolNotExists = !isUndefined(pairInfo) && checkIsPoolNotExists(pairInfo);

  const isPoolExists = !isPoolNotExists;

  return {
    pairInfo,
    updatePairInfo: loadPairInfo,
    isTokensOrderValid,
    tokenAPool,
    tokenBPool,
    isPoolExists,
    isPoolNotExists
  };
};
