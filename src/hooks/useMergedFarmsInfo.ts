import { useState, useEffect } from 'react';
import BigNumber from 'bignumber.js';

import { prettyPrice } from '@utils/helpers';
import { useFarms } from '@utils/dapp';
import { WhitelistedFarm } from '@utils/types';
import { STABLE_TOKEN } from '@utils/defaults';
import { calculatingAPR } from '@utils/helpers/calculateAPR';
import { useExchangeRates } from './useExchangeRate';
import { useUserInfoInAllFarms } from './useUserInfoInAllFarms';
import { useDexufs } from './useDexbufs';

export const useMergedFarmsInfo = () => {
  const { data: farms } = useFarms();
  const userInfoInAllFarms = useUserInfoInAllFarms();
  const exchangeRates = useExchangeRates();
  const dexbufs = useDexufs();
  const [mergedFarms, setMergedFarms] = useState<WhitelistedFarm[]>();
  const [isFarmsLoaded, setFarmsLoaded] = useState(false);

  useEffect(() => {
    const mergeFarmsInfo = async () => {
      if (!farms) return;
      if (!userInfoInAllFarms) return;
      if (dexbufs.length < 1) return;

      const price = new BigNumber(exchangeRates && exchangeRates.find
        ? exchangeRates
          .find((e:any) => e.tokenAddress === STABLE_TOKEN.contractAddress)?.exchangeRate
        : NaN);

      const merged:WhitelistedFarm[] = farms.map((farm, index) => {
        let deposit = '0'; let earned = '0';
        if (userInfoInAllFarms[+farm.farmId]) {
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
          totalValueLocked: prettyPrice(+farm.totalValueLocked * +price.toFixed(2)),
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

      setMergedFarms(merged);
      setFarmsLoaded(true);
    };

    mergeFarmsInfo();
  }, [farms, userInfoInAllFarms, dexbufs, exchangeRates]);

  return { mergedFarms, isFarmsLoaded };
};
