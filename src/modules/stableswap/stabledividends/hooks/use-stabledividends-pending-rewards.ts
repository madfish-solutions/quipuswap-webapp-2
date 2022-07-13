import { useMemo } from 'react';

import BigNumber from 'bignumber.js';

import { fromDecimals, isNull } from '@shared/helpers';

import { useStableDividendsItemStore } from '../../hooks';
import { StableDividendsRewardDetailsParams } from '../components/stabledividends-reward-details/types';

export const useStableDividendsPendingRewards = () => {
  const { item, userInfo } = useStableDividendsItemStore();
  const tokensInfo = item?.tokensInfo ?? null;

  const rawData: Array<StableDividendsRewardDetailsParams> = useMemo(() => {
    const helperArray: Array<StableDividendsRewardDetailsParams> = [];
    if (isNull(userInfo) || isNull(tokensInfo)) {
      return [];
    }

    userInfo.yourReward?.forEach((value, key) => {
      if (value.isGreaterThan('0')) {
        const tokenInfo = tokensInfo[key.toNumber()];
        const { token, exchangeRate } = tokenInfo;
        const amount = fromDecimals(value, token);
        helperArray.push({
          claimable: {
            amount,
            dollarEquivalent: amount.multipliedBy(exchangeRate)
          },
          token
        });
      }
    });

    return helperArray;
  }, [tokensInfo, userInfo]);

  const claimablePendingRewards = useMemo(() => {
    return rawData
      .map(({ claimable }) => claimable.dollarEquivalent)
      .reduce((acc, curr) => acc.plus(curr), new BigNumber('0'));
  }, [rawData]);

  return { rawData, claimablePendingRewards };
};
