import { useEffect, useState } from 'react';

import { FoundDex } from '@quipuswap/sdk';

import { loadT2tDex } from '@containers/liquidity/hooks/helpers/load-t2t-dex';
import { loadTezDex } from '@containers/liquidity/hooks/helpers/load-tez-dex';
import { isTezInPair } from '@containers/liquidity/liquidity-cards/helpers';
import { useNetwork, useTezos } from '@utils/dapp';
import { Nullable, WhitelistedToken } from '@utils/types';

export const useDexContract = (tokenA: Nullable<WhitelistedToken>, tokenB: Nullable<WhitelistedToken>) => {
  const tezos = useTezos();
  const networkId = useNetwork().id;

  const [dex, setDex] = useState<Nullable<FoundDex>>(null);

  useEffect(() => {
    const load = async () => {
      if (!tezos || !tokenA || !tokenB) {
        return;
      }

      const newDex = isTezInPair(tokenA.contractAddress, tokenB.contractAddress)
        ? await loadTezDex({
            tezos,
            networkId,
            tokenA,
            tokenB
          })
        : await loadT2tDex({ tezos });

      setDex(newDex);
    };

    void load();
  }, [networkId, tezos, tokenA, tokenB]);

  return dex;
};
