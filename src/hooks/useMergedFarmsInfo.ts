import { useState, useEffect } from 'react';

import { useAllFarms } from '@utils/dapp';
import { TEZOS_TOKEN, STABLE_TOKEN } from '@utils/defaults';
import { prettyPrice } from '@utils/helpers';
import { useTokenMetadata } from './useTokenMetadata';
import { useUserInfoInAllFarms } from './useUserInfoInAllFarms';

export const useMergedFarmsInfo = () => {
  const allFarms = useAllFarms();
  const tokenMetadata = useTokenMetadata();
  const userInfoInAllFarms = useUserInfoInAllFarms();
  const [farms, setFarms] = useState(allFarms);

  useEffect(() => {
    const mergeFarmsInfo = async () => {
      if (!allFarms) return;

      const mergedFarms = allFarms.map((farm, index) => {
        let tokenPair = { token1: TEZOS_TOKEN, token2: STABLE_TOKEN };
        if (tokenMetadata) {
          tokenPair = { token1: TEZOS_TOKEN, token2: tokenMetadata[index] };
        }

        let deposit = '0'; let
          earned = '0';
        if (userInfoInAllFarms) {
          deposit = prettyPrice(Number(userInfoInAllFarms[farm.id].staked));
          earned = prettyPrice(Number(userInfoInAllFarms[farm.id].earned));
        }
        return {
          ...farm,
          tokenPair,
          deposit,
          earned,
        };
      });

      setFarms(mergedFarms);
    };

    mergeFarmsInfo();
  }, [allFarms, tokenMetadata, userInfoInAllFarms]);

  return farms;
};
