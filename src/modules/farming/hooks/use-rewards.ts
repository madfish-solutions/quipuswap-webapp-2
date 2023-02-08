import { useMemo } from 'react';

import BigNumber from 'bignumber.js';

import { ZERO_AMOUNT_BN } from '@config/constants';
import { getSumOfNumbers, getTokenSlug, isQuipuToken, multipliedIfPossible, sumIfPossible } from '@shared/helpers';
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [farmingListStore, listStore.model, listBalancesStore.model]
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

        if (matchingReward) {
          matchingReward.staked.amount = matchingReward.staked.amount.plus(fullRewardBalance);
          matchingReward.staked.dollarEquivalent = sumIfPossible([
            matchingReward.staked.dollarEquivalent,
            reward.fullRewardUsd
          ]);
          if (shouldAddClaimable) {
            matchingReward.claimable.amount = matchingReward.claimable.amount.plus(earnBalance);
            matchingReward.claimable.dollarEquivalent = sumIfPossible([
              matchingReward.claimable.dollarEquivalent,
              reward.earnBalanceUsd
            ]);
          }
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

  const quipuRewards = useMemo(
    () => rewards.filter(reward => isQuipuToken(reward.rewardToken) && shouldHarvestInBatch(reward)),
    [rewards]
  );
  const rewardsInQuipu = useMemo(
    () => getSumOfNumbers(quipuRewards.map(({ earnBalance }) => earnBalance ?? null)),
    [quipuRewards]
  );
  const rewardsQuipuInUsd = useMemo(
    () => getSumOfNumbers(quipuRewards.map(({ earnBalanceUsd }) => earnBalanceUsd ?? null)),
    [quipuRewards]
  );

  return {
    rewards,
    claimablePendingRewardsInUsd,
    rewardsInQuipu,
    rewardsQuipuInUsd,
    totalPendingRewardsInUsd,
    tokensRewardList
  };
};
