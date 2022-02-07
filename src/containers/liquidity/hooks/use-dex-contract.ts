import { useCallback, useEffect, useState } from 'react';

import { FoundDex } from '@quipuswap/sdk';

import { NETWORK_ID } from '@app.config';
import { loadT2tDex } from '@containers/liquidity/hooks/helpers/load-t2t-dex';
import { loadTezDex } from '@containers/liquidity/hooks/helpers/load-tez-dex';
import { useTezos } from '@utils/dapp';
import { isSameTokens, isTezIncluded } from '@utils/helpers';
import { Nullable, WhitelistedToken } from '@utils/types';

interface State {
  dex: Nullable<FoundDex>;
  isLoading: boolean;
  data: {
    tokenA: Nullable<WhitelistedToken>;
    tokenB: Nullable<WhitelistedToken>;
  };
}

const DEFAULT_STATE: State = { dex: null, isLoading: true, data: { tokenA: null, tokenB: null } };

export const useDexContract = (tokenA: Nullable<WhitelistedToken>, tokenB: Nullable<WhitelistedToken>) => {
  const tezos = useTezos();

  const [state, setState] = useState<State>({ ...DEFAULT_STATE });

  const load = async () => {
    const isCached =
      (state.data.tokenA === tokenA || isSameTokens(state.data.tokenA, tokenA)) &&
      (state.data.tokenB === tokenB || isSameTokens(state.data.tokenB, tokenB));

    if (!tezos || !tokenA || !tokenB || isCached) {
      return;
    }

    setState({ ...DEFAULT_STATE, isLoading: true, data: { tokenA, tokenB } });
    const newDex = isTezIncluded([tokenA, tokenB])
      ? await loadTezDex({
          tezos,
          networkId: NETWORK_ID,
          tokenA,
          tokenB
        })
      : await loadT2tDex({ tezos });

    setState(s => ({ ...s, dex: newDex, isLoading: false }));
  };

  useEffect(() => {
    void load();
    // Load only on tozos and tokens change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tezos, tokenA, tokenB]);

  const clearDex = useCallback(() => setState({ ...DEFAULT_STATE }), []);

  return { ...state, clearDex };
};
