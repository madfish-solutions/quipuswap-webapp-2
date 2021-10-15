import { useEffect, useState } from 'react';
import { FoundDex } from '@quipuswap/sdk';

import {
  getStorageInfo,
  useNetwork,
  useStakes,
  useTezos,
} from '@utils/dapp';

export const useStakeDexes = () => {
  const network = useNetwork();
  const { data: stakes } = useStakes();
  const tezos = useTezos();
  const [dexbufs, setDexbufs] = useState<FoundDex[]>([]);

  useEffect(() => {
    const getDexbufs = async () => {
      if (!network) return;
      if (!stakes) return;
      if (!tezos) return;

      const dexs:Promise<FoundDex>[] = stakes.map(({ dex }) => getStorageInfo(tezos, dex));

      const dexsResolved = await Promise.all<FoundDex>(dexs);

      if (dexsResolved) {
        setDexbufs(dexsResolved);
      }
    };

    getDexbufs();
  }, [network, stakes, tezos]);

  return dexbufs;
};
