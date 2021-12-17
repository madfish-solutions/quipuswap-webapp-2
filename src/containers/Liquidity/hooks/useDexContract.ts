import { useEffect, useState } from 'react';

import { FoundDex } from '@quipuswap/sdk';

import { loadT2TDex } from '@containers/Liquidity/hooks/helpers/loadT2TDex';
import { loadTezDex } from '@containers/Liquidity/hooks/helpers/loadTezDex';
import { isTezInPair } from '@containers/Liquidity/liquidutyHelpers';
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
        : await loadT2TDex({ tezos });

      setDex(newDex);
    };

    void load();
  }, [networkId, tezos, tokenA, tokenB]);

  return dex;
};
