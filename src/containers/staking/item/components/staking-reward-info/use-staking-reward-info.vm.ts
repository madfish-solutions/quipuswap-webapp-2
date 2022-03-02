import { MS_IN_SECOND } from '@app.config';
import { useStakingItemStore } from '@hooks/stores/use-staking-item-store';
import { useBakers, useIsLoading } from '@utils/dapp';
import { bigNumberToString, getDollarEquivalent, isNull } from '@utils/helpers';

import { makeBaker } from '../helpers';

const mockLastStaked = Date.now();

export const useStakingRewardInfoViewModel = () => {
  const { itemStore, userStakingDelegateStore, userStakingStatsStore } = useStakingItemStore();
  const { data: bakers, loading: bakersLoading } = useBakers();
  const dAppLoading = useIsLoading();
  const {
    data: stakingStats,
    isLoading: stakingStatsStoreLoading,
    isInitialized: stakingStatsStoreInitialized
  } = userStakingStatsStore;
  const { data: stakeItem, isLoading: itemStoreLoading, isInitialized: itemStoreInitialized } = itemStore;
  const {
    data: delegateAddress,
    isLoading: stakingDelegateStoreLoading,
    isInitialized: stakingDelegateStoreInitialized
  } = userStakingDelegateStore;

  const stakingStatsStoreReady = stakingStatsStoreLoading || !stakingStatsStoreInitialized;
  const itemStoreReady = itemStoreLoading || !itemStoreInitialized;
  const stakingDelegateStoreReady = stakingDelegateStoreLoading || !stakingDelegateStoreInitialized;
  const stakingLoading = dAppLoading || !stakingStatsStoreReady || !itemStoreReady;
  const delegatesLoading = bakersLoading || stakingLoading || !stakingDelegateStoreReady;

  if (!stakeItem) {
    return {
      stakeItem,
      myDelegate: null,
      delegatesLoading,
      endTimestamp: null,
      myEarnDollarEquivalent: null,
      stakingLoading
    };
  }

  const myEarnDollarEquivalent = stakingStats
    ? getDollarEquivalent(
        // TODO: correct the formula
        stakingStats.earned.minus(stakingStats.prevEarned),
        bigNumberToString(stakeItem.earnExchangeRate)
      )
    : null;

  return {
    stakeItem,
    myDelegate: isNull(delegateAddress) ? null : makeBaker(delegateAddress, bakers),
    delegatesLoading,
    endTimestamp: mockLastStaked + Number(stakeItem.timelock) * MS_IN_SECOND,
    myEarnDollarEquivalent,
    stakingLoading
  };
};
