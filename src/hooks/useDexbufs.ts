import { useEffect, useState } from 'react';
import { FoundDex, findDex, Token } from '@quipuswap/sdk';

import {
  getStorageInfo,
  useAllFarms,
  useNetwork,
  useTezos,
} from '@utils/dapp';
import { FACTORIES } from '@utils/defaults';
import { QSMainNet } from '@utils/types';

export const useDexufs = () => {
  const network = useNetwork();
  const allFarms = useAllFarms();
  const tezos = useTezos();
  const [dexbufs, setDexbufs] = useState<FoundDex[]>();

  useEffect(() => {
    const getDexbufs = async () => {
      if (!network) return;
      if (!allFarms) return;
      if (!tezos) return;

      const dexs:Promise<FoundDex>[] = allFarms.map((farm) => {
        let asset:Token = { contract: '' };

        if (farm.stakedToken.fA2) {
          asset = {
            contract: farm.stakedToken.fA2.token,
            id: farm.stakedToken.fA2.id,
          };
        }

        if (farm.stakedToken.fA12) {
          asset = { contract: farm.stakedToken.fA12 };
        }

        if (farm.isLpTokenStaked) {
          return getStorageInfo(tezos, <string>asset.contract);
        }

        return findDex(tezos, FACTORIES[network.id as QSMainNet], asset);
      });

      const dexsResolved = await Promise.all<FoundDex>(dexs);

      if (dexsResolved) {
        setDexbufs(dexsResolved);
      }
    };

    getDexbufs();
  }, [network, allFarms, tezos]);

  return dexbufs;
};
