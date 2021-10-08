import { useState, useEffect } from 'react';

import { prettyPrice } from '@utils/helpers';
import { useFarms } from '@utils/dapp';
import { WhitelistedFarm } from '@utils/types';
import { useUserInfoInAllFarms } from './useUserInfoInAllFarms';

export const useMergedFarmsInfo = () => {
  const { data: farms } = useFarms();
  const userInfoInAllFarms = useUserInfoInAllFarms();
  const [mergedFarms, setMergedFarms] = useState<WhitelistedFarm[]>();

  useEffect(() => {
    const mergeFarmsInfo = async () => {
      if (!farms) return;

      // TODO: calculate APR/APY and Daily, add tokenContract farmContract projectLink analyticsLink
      // @ts-ignore
      const merged:WhitelistedFarm[] = farms.map((farm) => {
        let deposit = '0'; let earned = '0';
        if (userInfoInAllFarms) {
          deposit = prettyPrice(Number(userInfoInAllFarms[+farm.farmId]?.staked));
          earned = prettyPrice(Number(userInfoInAllFarms[+farm.farmId]?.earned));
        }

        return {
          ...farm,
          deposit,
          earned,
          remaining: new Date(),
        };
      });

      setMergedFarms(merged);
    };

    mergeFarmsInfo();
  }, [farms, userInfoInAllFarms]);

  return mergedFarms;
};
