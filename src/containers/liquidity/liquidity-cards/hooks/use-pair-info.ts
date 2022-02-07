import { useEffect, useState } from 'react';

import { FoundDex } from '@quipuswap/sdk';

import { TOKEN_TO_TOKEN_DEX } from '@app.config';
import { isSameDex, isSameTokens } from '@utils/helpers';
import { Nullable, WhitelistedToken } from '@utils/types';

import { PairInfo } from '../add-liquidity-form';
import { loadTokenToTokenPairInfo } from '../blockchain';
import { getTezTokenPairInfo } from '../helpers';

interface State {
  pairInfo: Nullable<PairInfo>;
  isLoading: boolean;
  data: {
    dex: Nullable<FoundDex>;
    tokenA: Nullable<WhitelistedToken>;
    tokenB: Nullable<WhitelistedToken>;
  };
}

const DEFAULT_STATE: State = { pairInfo: null, isLoading: true, data: { dex: null, tokenA: null, tokenB: null } };

export const usePairInfo = (
  dex: Nullable<FoundDex>,
  tokenA: Nullable<WhitelistedToken>,
  tokenB: Nullable<WhitelistedToken>
) => {
  const [state, setState] = useState<State>({ ...DEFAULT_STATE });

  const loadPairInfo = async (
    dex: Nullable<FoundDex>,
    tokenA: Nullable<WhitelistedToken>,
    tokenB: Nullable<WhitelistedToken>
  ) => {
    const isCached =
      (state.data.dex === dex || isSameDex(state.data.dex, dex)) &&
      (state.data.tokenA === tokenA || isSameTokens(state.data.tokenA, tokenA)) &&
      (state.data.tokenB === tokenB || isSameTokens(state.data.tokenB, tokenB));

    if (!dex || !tokenA || !tokenB || state.isLoading || isCached) {
      return;
    }

    setState({ ...DEFAULT_STATE, isLoading: true, data: { dex, tokenA, tokenB } });
    const newPairInfo =
      dex.contract.address === TOKEN_TO_TOKEN_DEX
        ? await loadTokenToTokenPairInfo(dex, tokenA, tokenB)
        : getTezTokenPairInfo(dex, tokenA, tokenB);

    setState(s => ({ ...s, pairInfo: newPairInfo, isLoading: false }));
  };

  useEffect(() => {
    void loadPairInfo(dex, tokenA, tokenB);
    // Waiting for DEX changing because it is loading asynchronously
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dex]);

  return { ...state, updatePairInfo: loadPairInfo };
};
