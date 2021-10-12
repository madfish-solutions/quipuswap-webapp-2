import { useState, useEffect } from 'react';
import BigNumber from 'bignumber.js';

import { prettyPrice } from '@utils/helpers';
import { useFarms } from '@utils/dapp';
import { WhitelistedFarm } from '@utils/types';
import { STABLE_TOKEN } from '@utils/defaults';
import { useUserInfoInAllFarms } from './useUserInfoInAllFarms';
import { useExchangeRates } from './useExchangeRate';

export const useMergedFarmsInfo = () => {
  const { data: farms } = useFarms();

  const userInfoInAllFarms = useUserInfoInAllFarms();
  const exchangeRates = useExchangeRates();
  const [mergedFarms, setMergedFarms] = useState<WhitelistedFarm[]>();

  useEffect(() => {
    const mergeFarmsInfo = async () => {
      if (!farms) return;
      if (!userInfoInAllFarms) return;

      const price = new BigNumber(exchangeRates && exchangeRates.find
        ? exchangeRates
          .find((e:any) => e.tokenAddress === STABLE_TOKEN.contractAddress)?.exchangeRate
        : NaN);

      const merged:WhitelistedFarm[] = farms.map((farm) => {
        let deposit = '0'; let earned = '0';
        if (userInfoInAllFarms[+farm.farmId]) {
          deposit = prettyPrice(Number(userInfoInAllFarms[+farm.farmId]?.staked));
          earned = prettyPrice(Number(userInfoInAllFarms[+farm.farmId]?.earned));
        }

        return {
          ...farm,
          totalValueLocked: prettyPrice(+farm.totalValueLocked * +price.toFixed(2)),
          deposit,
          earned,
          apy: '100%',
          daily: '213%',
          tokenContract: '#',
          farmContract: '#',
          projectLink: '#',
          analyticsLink: '#',
          remaining: new Date(),
        };
      });

      setMergedFarms(merged);
    };

    mergeFarmsInfo();
  }, [farms, userInfoInAllFarms, exchangeRates]);

  return mergedFarms;
};
