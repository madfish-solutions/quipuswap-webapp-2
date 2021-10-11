import { useEffect, useState } from 'react';

import {
  useAccountPkh,
  useFarms,
  useFarmingStorage,
  useNetwork,
  useTezos,
} from '@utils/dapp';

export const useProfit = () => {
  const network = useNetwork();
  const tezos = useTezos();
  const farmimgStorage = useFarmingStorage();
  const accountPkh = useAccountPkh();
  const { data: farms } = useFarms();

  const [profits, setProfits] = useState<number[]>([]);

  useEffect(() => {
    const calculateProfit = () => {
      if (!tezos) return;
      if (!network) return;
      if (!farmimgStorage) return;
      if (!farms) return;

      const profitsArray = farms.map((farm) => {
        if ((typeof farm.startTime === 'string') && farm.claimed) {
          return (
            Date.now() - Date.parse(farm.startTime)
          ) * parseInt(farm.rewardPerSecond.toString() ?? '0', 10) - +farm.claimed;
        }

        return 0;
      });

      setProfits(profitsArray);
    };

    if (accountPkh) {
      calculateProfit();
    }
  }, [farms, network, tezos, farmimgStorage, accountPkh]);

  return profits;
};
