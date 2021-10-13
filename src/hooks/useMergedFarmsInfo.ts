import { useState, useEffect } from 'react';
import { estimateTezInShares } from '@quipuswap/sdk';

import { prettyPrice } from '@utils/helpers';
import { useFarms } from '@utils/dapp';
import { WhitelistedFarm } from '@utils/types';
import { calculatingAPR } from '@utils/helpers/calculateAPR';
import BigNumber from 'bignumber.js';
import { useUserInfoInAllFarms } from './useUserInfoInAllFarms';
import { useDexufs } from './useDexbufs';
import { useExchangeRates } from './useExchangeRate';

export const useMergedFarmsInfo = () => {
  const { data: farms } = useFarms();
  const userInfoInAllFarms = useUserInfoInAllFarms();
  const dexbufs = useDexufs();
  const [mergedFarms, setMergedFarms] = useState<WhitelistedFarm[]>();
  const [isFarmsLoaded, setFarmsLoaded] = useState(false);
  const exchangeRates = useExchangeRates();

  useEffect(() => {
    const mergeFarmsInfo = async () => {
      if (!farms) return;
      if (dexbufs.length < 1) return;

      const merged:WhitelistedFarm[] = farms.map((farm, index) => {
        let deposit = '0'; let earned = '0';
        if (userInfoInAllFarms && userInfoInAllFarms[+farm.farmId]) {
          deposit = prettyPrice(Number(userInfoInAllFarms[+farm.farmId]?.staked));
          earned = prettyPrice(Number(userInfoInAllFarms[+farm.farmId]?.earned));
        }

        const totalValueLocked = estimateTezInShares(
          dexbufs[index],
          new BigNumber(farm.totalValueLocked),
        )
          .toString();

        const {
          apr, apyDaily,
        } = calculatingAPR(
          dexbufs[index],
          farm.totalValueLocked,
          farm.rewardPerSecond,
        );

        return {
          ...farm,
          totalValueLocked,
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
