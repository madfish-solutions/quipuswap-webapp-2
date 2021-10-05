import { useEffect, useState } from 'react';
import {
  FarmingInfoType,
  WhitelistedFarm, WhitelistedTokenPair,
} from '@utils/types';
import {
  useFarmingStorage,
  useNetwork,
  useTezos,
} from '@utils/dapp';
import { TEZOS_TOKEN } from '@utils/defaults';
import { prettyPrice } from '@utils/helpers';

const fallbackPair = {
  token1: TEZOS_TOKEN,
  token2: TEZOS_TOKEN,
} as WhitelistedTokenPair;

export const useFarms = () => {
  const tezos = useTezos();
  const network = useNetwork();
  const farmingStorage = useFarmingStorage();
  const [allFarms, setAllFarms] = useState<WhitelistedFarm[]>([]);

  useEffect(() => {
    const loadFarms = async () => {
      if (!tezos) return;
      if (!network) return;
      if (!farmingStorage) return;

      const possibleFarms:Promise<FarmingInfoType | undefined>[] = new Array(
        +farmingStorage?.storage.farms_count.toString(),
      )
        .fill(0)
        .map(async (x, id) => (farmingStorage?.storage.farms.get(id)));

      const tempFarms = await Promise.all(possibleFarms);

      if (tempFarms) {
        const whitelistedFarms:WhitelistedFarm[] = tempFarms
          .filter((x) => !!x)
          .map((x, id) => ({
            id,
            tokenPair: fallbackPair,
            totalValueLocked: prettyPrice(Number(x?.staked)),
            apy: '888%',
            daily: '0.008%',
            balance: '1000000.00',
            multiplier: '888',
            tokenContract: '#',
            farmContract: '#',
            projectLink: '#',
            analyticsLink: '#',
            remaining: new Date(Date.now() + 48 * 3600000),
            claimed: x?.claimed.toString(),
            startTime: x?.start_time.toString(),
            rewardPerSecond: x?.reward_per_second,
          }));

        setAllFarms(whitelistedFarms);
      }
    };

    loadFarms();
  }, [tezos, network, farmingStorage]);

  return allFarms;
};
