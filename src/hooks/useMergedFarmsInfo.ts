import { useState, useEffect } from 'react';
import { estimateTezInShares } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';

import { useFarms } from '@utils/dapp';
import { WhitelistedFarm } from '@utils/types';
import { calculatingAPR } from '@utils/helpers/calculateAPR';
import { useUserInfoInAllFarms } from './useUserInfoInAllFarms';
import { useDexufs } from './useDexbufs';
import { useExchangeRates } from './useExchangeRate';

export const useMergedFarmsInfo = () => {
  const { data: farms } = useFarms();
  const { userInfoInFarms: userInfoInAllFarms } = useUserInfoInAllFarms();
  const dexbufs = useDexufs();
  const [mergedFarms, setMergedFarms] = useState<WhitelistedFarm[]>();
  const [isFarmsLoaded, setFarmsLoaded] = useState(false);
  const exchangeRates = useExchangeRates();

  useEffect(() => {
    const mergeFarmsInfo = async () => {
      if (!farms) return;
      if (dexbufs.length < 1) return;

      const merged:WhitelistedFarm[] = farms.map((farm, index) => {
        let deposit = new BigNumber(0);
        let earned = new BigNumber(0);
        if (userInfoInAllFarms && userInfoInAllFarms[+farm.farmId]) {
          deposit = new BigNumber(userInfoInAllFarms[+farm.farmId]?.staked ?? 0);
          earned = new BigNumber(userInfoInAllFarms[+farm.farmId]?.earned ?? 0);
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
          dexStorage: dexbufs[index],
          totalValueLocked,
          deposit,
          earned,
          apr,
          apyDaily,
          tokenContract: `https://tzkt.io/${farm.rewardToken.contractAddress}`,
          farmContract: `https://tzkt.io/${farm.stakedToken.contractAddress}`,
          analyticsLink: `https://analytics.quipuswap.com/pairs/${farm.stakedToken.contractAddress}`,
        };
      });

      setMergedFarms(merged);
      setFarmsLoaded(true);
    };

    mergeFarmsInfo();
  }, [farms, userInfoInAllFarms, dexbufs, exchangeRates]);

  return { mergedFarms, isFarmsLoaded };
};
