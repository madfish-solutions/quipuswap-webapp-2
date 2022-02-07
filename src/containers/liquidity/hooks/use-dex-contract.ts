import { useCallback, useEffect, useState } from 'react';

import { FoundDex } from '@quipuswap/sdk';

import { NETWORK_ID } from '@app.config';
import { loadT2tDex } from '@containers/liquidity/hooks/helpers/load-t2t-dex';
import { loadTezDex } from '@containers/liquidity/hooks/helpers/load-tez-dex';
import { useTezos } from '@utils/dapp';
import { isTezIncluded } from '@utils/helpers';
import { Nullable, Token, Optional } from '@utils/types';

export const useDexContract = (tokenA: Nullable<Token>, tokenB: Nullable<Token>) => {
  const tezos = useTezos();

  const [dex, setDex] = useState<Optional<FoundDex>>(undefined); //TODO: remove

  useEffect(() => {
    const load = async () => {
      if (!tezos || !tokenA || !tokenB) {
        setDex(undefined);

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

  const clearDex = useCallback(() => setDex(undefined), []);

  return { dex, clearDex };
};
