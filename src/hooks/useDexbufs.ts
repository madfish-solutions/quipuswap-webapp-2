import { useEffect, useState } from 'react';
import { FoundDex, Token } from '@quipuswap/sdk';

import {
  getStorageInfo,
  useFarms,
  useNetwork,
  useTezos,
} from '@utils/dapp';

export const useDexufs = () => {
  const network = useNetwork();
  const { data: farms } = useFarms();
  const tezos = useTezos();
  const [dexbufs, setDexbufs] = useState<FoundDex[]>([]);

  useEffect(() => {
    const getDexbufs = async () => {
      if (!network) return;
      if (!farms) return;
      if (!tezos) return;

      const dexs:Promise<FoundDex>[] = farms.map((farm) => {
        const asset:Token = {
          contract: farm.stakedToken.contractAddress,
          id: farm.stakedToken.fa2TokenId,
        };

        return getStorageInfo(tezos, <string>asset.contract);
      });

      const dexsResolved = await Promise.all<FoundDex>(dexs);

      if (dexsResolved) {
        setDexbufs(dexsResolved);
      }
    };

    getDexbufs();
  }, [network, farms, tezos]);

  return dexbufs;
};
