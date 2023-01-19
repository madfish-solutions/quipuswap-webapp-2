import { useMemo } from 'react';

import BigNumber from 'bignumber.js';

import { ZERO_AMOUNT_BN } from '@config/constants';
import { getSumOfNumbers, getTokenSlug, multipliedIfPossible } from '@shared/helpers';
import { Nullable, Token } from '@shared/types';

import { shouldHarvestInBatch } from '../helpers';
import { useFarmingListStore } from './stores';

interface RewardAmount {
  amount: BigNumber;
  dollarEquivalent: Nullable<BigNumber>;
}
interface TokensReward {
  token: Token;
  staked: RewardAmount;
  claimable: RewardAmount;
}

export const useRewards = () => {
  const farmingListStore = useFarmingListStore();
  const { listStore, listBalancesStore } = farmingListStore;
  const rewardsAreReady = listStore.isReady && listBalancesStore.isReady;

  const rewards = useMemo(
    () =>
      farmingListStore.farmingItemsWithBalances
        .filter(
          ({ earnBalance, fullRewardBalance, rewardToken }) =>
            (earnBalance?.gt(ZERO_AMOUNT_BN) || fullRewardBalance?.gt(ZERO_AMOUNT_BN)) && rewardToken
        )
        .map(({ earnBalance, fullRewardBalance, rewardToken, contractAddress, id, version, earnExchangeRate }) => ({
          earnBalance,
          earnBalanceUsd: multipliedIfPossible(earnBalance, earnExchangeRate),
          earnExchangeRate,
          fullRewardBalance,
          fullRewardUsd: multipliedIfPossible(fullRewardBalance, earnExchangeRate),
          rewardToken,
          contractAddress,
          id,
          version
        })),
    [farmingListStore.farmingItemsWithBalances]
  );

  const claimablePendingRewardsInUsd = useMemo(() => {
    if (rewardsAreReady) {
      return getSumOfNumbers(
        rewards.map(reward => (shouldHarvestInBatch(reward) ? reward.earnBalanceUsd ?? null : ZERO_AMOUNT_BN))
      );
    }

    return null;
  }, [rewardsAreReady, rewards]);

  const totalPendingRewardsInUsd = useMemo(() => {
    if (rewardsAreReady) {
      return getSumOfNumbers(rewards.map(({ fullRewardUsd }) => fullRewardUsd ?? null));
    }

    return null;
  }, [rewardsAreReady, rewards]);

  const tokensRewardList = useMemo(
    () =>
      rewards.reduce<TokensReward[]>((rewardsSum, reward) => {
        const { rewardToken } = reward;
        const shouldAddClaimable = shouldHarvestInBatch(reward);
        const matchingReward = rewardsSum.find(({ token }) => getTokenSlug(token) === getTokenSlug(rewardToken));
        const fullRewardBalance = reward.fullRewardBalance ?? ZERO_AMOUNT_BN;
        const earnBalance = reward.earnBalance ?? ZERO_AMOUNT_BN;

        if (matchingReward && shouldAddClaimable) {
          matchingReward.staked.amount = matchingReward.staked.amount.plus(fullRewardBalance);
          matchingReward.staked.dollarEquivalent =
            matchingReward.staked.dollarEquivalent?.plus(reward.fullRewardUsd ?? ZERO_AMOUNT_BN) ?? null;
          matchingReward.claimable.amount = matchingReward.claimable.amount.plus(earnBalance);
          matchingReward.claimable.dollarEquivalent =
            matchingReward.claimable.dollarEquivalent?.plus(reward.earnBalanceUsd ?? ZERO_AMOUNT_BN) ?? null;
        } else {
          rewardsSum.push({
            token: rewardToken,
            staked: {
              amount: fullRewardBalance,
              dollarEquivalent: reward.fullRewardUsd ?? null
            },
            claimable: shouldAddClaimable
              ? {
                  amount: earnBalance,
                  dollarEquivalent: reward.earnBalanceUsd ?? null
                }
              : {
                  amount: ZERO_AMOUNT_BN,
                  dollarEquivalent: ZERO_AMOUNT_BN
                }
          });
        }

        return rewardsSum;
      }, []),
    [rewards]
  );

  return {
    rewards,
    claimablePendingRewardsInUsd,
    totalPendingRewardsInUsd,
    tokensRewardList
  };
};
