import { useState, useEffect } from 'react';

import { TEZOS_TOKEN, STABLE_TOKEN } from '@utils/defaults';
import { prettyPrice } from '@utils/helpers';
import { FarmsType } from '@utils/types';
import { useUserInfoInAllFarms } from './useUserInfoInAllFarms';
import { useFarms } from './useFarms';

const tokenPair = {
  token1: TEZOS_TOKEN,
  token2: STABLE_TOKEN,
};

export const useMergedFarmsInfo = () => {
  const farms = useFarms();
  const userInfoInAllFarms = useUserInfoInAllFarms();
  const [mergedFarms, setMergedFarms] = useState<FarmsType[]>();

  useEffect(() => {
    const mergeFarmsInfo = async () => {
      if (!farms) return;

      const merged = farms.map((farm) => {
        let deposit = '0'; let
          earned = '0';
        if (userInfoInAllFarms) {
          deposit = prettyPrice(Number(userInfoInAllFarms[+farm.fid]?.staked));
          earned = prettyPrice(Number(userInfoInAllFarms[+farm.fid]?.earned));
        }
        return {
          ...farm,
          deposit,
          earned,
          tokenPair,
          remaining: new Date(),
        };
      });

      console.log({ merged });

      setMergedFarms(merged);
    };

    mergeFarmsInfo();
  }, [farms, userInfoInAllFarms]);

  return mergedFarms;
};
