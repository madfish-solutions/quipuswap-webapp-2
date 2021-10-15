import { useState, useEffect } from 'react';
import BigNumber from 'bignumber.js';

import { useStakes } from '@utils/dapp';
import { WhitelistedFarm, WhitelistedStake } from '@utils/types';
import { calculatingAPR } from '@utils/helpers/calculateAPR';
import { useExchangeRates } from './useExchangeRate';
import { useUserInfoInAllStake } from './useUserInfoInAllStake';
import { useStakeDexes } from './useStakeDexes';

export const useMergedStakesInfo = () => {
  const { data: stakes } = useStakes();
  const { userInfoInStakes: userInfoInAllStake } = useUserInfoInAllStake();
  const dexbufs = useStakeDexes();
  const [mergedStakes, setMergedStakes] = useState<WhitelistedFarm[]>();
  const [isStakesLoaded, setStakesLoaded] = useState(false);
  const exchangeRates = useExchangeRates();

  useEffect(() => {
    const mergeFarmsInfo = async () => {
      if (!stakes) return;
      if (dexbufs.length < 1) return;

      const merged:WhitelistedStake[] = stakes.map((stake, index) => {
        let deposit = new BigNumber(0);
        let earned = new BigNumber(0);
        if (userInfoInAllStake && userInfoInAllStake[+stake.farmId]) {
          deposit = new BigNumber(userInfoInAllStake[+stake.farmId]?.staked ?? 0);
          earned = new BigNumber(userInfoInAllStake[+stake.farmId]?.earned ?? 0);
        }

        const { totalValueLocked } = stake;

        const {
          apr, apyDaily,
        } = calculatingAPR(
          dexbufs[index],
          stake.totalValueLocked,
          stake.rewardPerSecond,
        );

        return {
          ...stake,
          dexStorage: dexbufs[index],
          totalValueLocked,
          deposit,
          earned,
          apr,
          apyDaily,
          tokenContract: `https://tzkt.io/${stake.rewardToken.contractAddress}`,
          farmContract: `https://tzkt.io/${stake.stakedToken.contractAddress}`,
          analyticsLink: `https://analytics.quipuswap.com/pairs/${stake.stakedToken.contractAddress}`,
        };
      });

      setMergedStakes(merged);
      setStakesLoaded(true);
    };

    mergeFarmsInfo();
  }, [stakes, userInfoInAllStake, dexbufs, exchangeRates]);

  return { mergedStakes, isStakesLoaded };
};
