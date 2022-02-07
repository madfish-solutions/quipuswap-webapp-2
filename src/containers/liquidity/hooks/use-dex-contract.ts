import { useCallback, useEffect, useState } from 'react';

import { FoundDex } from '@quipuswap/sdk';

import { NETWORK_ID } from '@app.config';
import { loadT2tDex } from '@containers/liquidity/hooks/helpers/load-t2t-dex';
import { loadTezDex } from '@containers/liquidity/hooks/helpers/load-tez-dex';
import { useTezos } from '@utils/dapp';
import { isTezIncluded } from '@utils/helpers';
import { Nullable, WhitelistedToken } from '@utils/types';

export const useDexContract = (tokenA: Nullable<WhitelistedToken>, tokenB: Nullable<WhitelistedToken>) => {
  const tezos = useTezos();

  const [dex, setDex] = useState<Nullable<FoundDex>>(undefined as never as null); //TODO: remove

  useEffect(() => {
    const load = async () => {
      if (!tezos || !tokenA || !tokenB) {
        setDex(undefined as never as null);

        return;
      }

      const newDex = isTezIncluded([tokenA, tokenB])
        ? await loadTezDex({
            tezos,
            networkId: NETWORK_ID,
            tokenA,
            tokenB
          })
        : await loadT2tDex({ tezos });

      setDex(newDex);
    };

    void load();
  }, [tezos, tokenA, tokenB]);

  const clearDex = useCallback(() => setDex(undefined as never as null), []);

  return { dex, clearDex };
};
