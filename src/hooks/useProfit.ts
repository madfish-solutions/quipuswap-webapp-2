import { useEffect, useState } from 'react';

import {
  useAccountPkh,
  useFarmingStorage,
  useNetwork,
  useTezos,
} from '@utils/dapp';
import { useFarms } from '@hooks/useFarms';

export const useProfit = () => {
  const network = useNetwork();
  const tezos = useTezos();
  const farmimgStorage = useFarmingStorage();
  const accountPkh = useAccountPkh();
  const allFarms = useFarms();

  const [profits, setProfits] = useState<number[]>([]);

  useEffect(() => {
    const calculateProfit = () => {
      if (!tezos) return;
      if (!network) return;
      if (!farmimgStorage) return;

      const profitsArray = allFarms.map((farm) => {
        if ((typeof farm?.startTime === 'string') && farm?.claimed) {
          return (
            Date.now() - Date.parse(farm?.startTime)
          ) * parseInt(farm?.rewardPerSecond?.toString() ?? '0', 10) - +farm?.claimed;
        }

        return 0;
      });

      setProfits(profitsArray);
    };

    if (accountPkh) {
      calculateProfit();
    }
  }, [allFarms, network, tezos, farmimgStorage, accountPkh]);

  return profits;
};
