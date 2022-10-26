import { useCallback } from 'react';

import BigNumber from 'bignumber.js';

import { MS_IN_SECOND, ZERO_AMOUNT, ZERO_AMOUNT_BN } from '@config/constants';
import { QUIPU_TOKEN } from '@config/tokens';
import { useFarmingYouvesItemStore } from '@modules/farming/hooks';
import { getNowTimestampInSeconds } from '@shared/helpers';

export const useGetConfirmationMessageParams = () => {
  const { item, currentStake, claimableRewards, longTermRewards } = useFarmingYouvesItemStore();

  return useCallback(
    (amountToStakeAtoms: BigNumber) => {
      if (!item) {
        return {
          totalDeposit: undefined,
          waitingTimeSeconds: ZERO_AMOUNT_BN,
          rewardToken: QUIPU_TOKEN,
          realLostRewardAmount: ZERO_AMOUNT_BN
        };
      }
      const currentAgeTimestamp = Math.floor(
        new Date(currentStake?.age_timestamp ?? ZERO_AMOUNT).getTime() / MS_IN_SECOND
      );
      const now = new BigNumber(getNowTimestampInSeconds());

      const stakeAge = BigNumber.min(now.minus(currentAgeTimestamp), item.vestingPeriodSeconds);
      const stakedAmount = currentStake?.stake ?? ZERO_AMOUNT_BN;
      const newStakedAmount = stakedAmount.plus(amountToStakeAtoms);
      const newAgeTimestamp = now.minus(stakedAmount.times(stakeAge).dividedToIntegerBy(newStakedAmount));
      const waitingTimeSeconds = Math.max(
        newAgeTimestamp.minus(now).plus(item.vestingPeriodSeconds).toNumber(),
        ZERO_AMOUNT
      );

      return {
        totalDeposit: currentStake?.stake,
        waitingTimeSeconds,
        rewardToken: item.rewardToken,
        realLostRewardAmount: longTermRewards?.minus(claimableRewards ?? ZERO_AMOUNT_BN) ?? ZERO_AMOUNT_BN
      };
    },
    [currentStake, item, claimableRewards, longTermRewards]
  );
};
