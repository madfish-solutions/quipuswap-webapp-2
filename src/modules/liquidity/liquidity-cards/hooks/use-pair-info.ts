import { useCallback, useEffect, useState } from 'react';

import { FoundDex } from '@quipuswap/sdk';

import { TOKEN_TO_TOKEN_DEX } from '@config/enviroment';
import { isNull, isUndefined } from '@shared/helpers';
import { Nullable, Optional, Token } from '@shared/types';

import { PairInfo } from '../add-liquidity-form';
import { loadTokenToTokenPairInfo } from '../blockchain/getters';
import { checkIsPoolNotExists, getTezTokenPairInfo } from '../helpers';

export const usePairInfo = (dex: Optional<FoundDex>, tokenA: Nullable<Token>, tokenB: Nullable<Token>) => {
  const [pairInfo, setPairInfo] = useState<Optional<PairInfo>>(undefined);

  const getPairInfo = useCallback(
    async (_dex: Optional<FoundDex>, _tokenA: Nullable<Token>, _tokenB: Nullable<Token>) => {
      if (isUndefined(_dex)) {
        return undefined;
      }

      if (isNull(_dex) || isNull(_tokenA) || isNull(_tokenB)) {
        return null;
      }

      return _dex.contract.address === TOKEN_TO_TOKEN_DEX
        ? await loadTokenToTokenPairInfo(_dex, _tokenA, _tokenB)
        : getTezTokenPairInfo(_dex, _tokenA, _tokenB);
    },
    []
  );

  const loadPairInfo = async (_dex: Optional<FoundDex>, _tokenA: Nullable<Token>, _tokenB: Nullable<Token>) =>
    setPairInfo(await getPairInfo(_dex, _tokenA, _tokenB));

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
