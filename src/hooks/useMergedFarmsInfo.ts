import { useState, useEffect } from 'react';
import { estimateTezInShares, estimateTezToToken } from '@quipuswap/sdk';

import { useAllFarms } from '@utils/dapp';
import { TEZOS_TOKEN, STABLE_TOKEN } from '@utils/defaults';
import { prettyPrice } from '@utils/helpers';
import { useTokenMetadata } from './useTokenMetadata';
import { useUserInfoInAllFarms } from './useUserInfoInAllFarms';
import { useDexufs } from './useDexbufs';

export const useMergedFarmsInfo = () => {
  const allFarms = useAllFarms();
  const tokenMetadata = useTokenMetadata();
  const userInfoInAllFarms = useUserInfoInAllFarms();
  const dexbufs = useDexufs();
  const [farms, setFarms] = useState(allFarms);

  useEffect(() => {
    const mergeFarmsInfo = async () => {
      if (!allFarms) return;
      if (!dexbufs) return;

      const APRs = allFarms.map((farm, index) => {
        const secondsInYear = 31536000; // 365 * 24 * 60 * 60

        const total = estimateTezInShares(dexbufs[index], farm.totalValueLocked);
        const perSecond = estimateTezToToken(dexbufs[index], farm.rewardPerSecond);

        if (perSecond.eq(0)) {
          return '<0.01%';
        }

        const prettiedAPR = prettyPrice(
          +total.dividedBy(perSecond.multipliedBy(secondsInYear)).multipliedBy(100).toString(),
          2,
        );

        if (prettiedAPR === '0') {
          return '<0.01%';
        }

        return prettiedAPR;
      });

      const mergedFarms = allFarms.map((farm, index) => {
        let tokenPair = { token1: TEZOS_TOKEN, token2: STABLE_TOKEN };

        if (tokenMetadata) {
          tokenPair = { token1: TEZOS_TOKEN, token2: tokenMetadata[index] };
        }

        let deposit = '0';
        let earned = '0';

        if (userInfoInAllFarms) {
          deposit = prettyPrice(Number(userInfoInAllFarms[farm.id]?.staked));
          earned = prettyPrice(Number(userInfoInAllFarms[farm.id]?.earned));
        }

        return {
          ...farm,
          tokenPair,
          deposit,
          earned,
          apy: APRs[index],
        };
      });

      setFarms(mergedFarms);
    };

    mergeFarmsInfo();
  }, [allFarms, tokenMetadata, userInfoInAllFarms, dexbufs]);

  return farms;
};
