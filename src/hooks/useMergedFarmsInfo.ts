import { useState, useEffect } from 'react';

import { prettyPrice } from '@utils/helpers';
import { useFarms } from '@utils/dapp';
import { WhitelistedFarm } from '@utils/types';
import { calculatingAPR } from '@utils/helpers/calculateAPR';
import { useUserInfoInAllFarms } from './useUserInfoInAllFarms';
import { useDexufs } from './useDexbufs';

export const useMergedFarmsInfo = () => {
  const { data: farms } = useFarms();
  const userInfoInAllFarms = useUserInfoInAllFarms();
  const dexbufs = useDexufs();
  const [farms, setFarms] = useState(allFarms);
  const [isFarmsLoaded, setFarmsLoaded] = useState(false);

  useEffect(() => {
    const mergeFarmsInfo = async () => {
      if (!farms) return;
      if (dexbufs.length < 1) return;

      const merged:WhitelistedFarm[] = farms.map((farm, index) => {
        let deposit = '0'; let earned = '0';
        if (userInfoInAllFarms) {
          deposit = prettyPrice(Number(userInfoInAllFarms[+farm.farmId]?.staked));
          earned = prettyPrice(Number(userInfoInAllFarms[+farm.farmId]?.earned));
        }
        const {
          apr, apyDaily,
        } = calculatingAPR(
          dexbufs[index],
          farm.totalValueLocked,
          farm.rewardPerSecond,
        );

        return {
          ...farm,
          deposit,
          earned,
          apr,
          apyDaily,
          tokenContract: '#',
          farmContract: '#',
          projectLink: '#',
          analyticsLink: '#',
          remaining: new Date(),
        };
      });

      setFarms(mergedFarms);
      setFarmsLoaded(true);
    };

    mergeFarmsInfo();
  }, [farms, userInfoInAllFarms, dexbufs]);

  return { farms, isFarmsLoaded };
};
