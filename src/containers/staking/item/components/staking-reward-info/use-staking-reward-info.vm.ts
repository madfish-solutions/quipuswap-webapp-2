import { harvestAssetsApi } from '@api/staking/harvest-assets.api';
import { MS_IN_SECOND } from '@app.config';
import { useStakingItemStore } from '@hooks/stores/use-staking-item-store';
import { useAccountPkh, useBakers, useIsLoading, useTezos } from '@utils/dapp';
import { bigNumberToString, defined, fromDecimals, getDollarEquivalent, isExist, isNull } from '@utils/helpers';

import { canDelegate, makeBaker } from '../../helpers';

export const useStakingRewardInfoViewModel = () => {
  const stakingItemStore = useStakingItemStore();
  const { itemStore, userStakingDelegateStore, userStakingStatsStore } = stakingItemStore;
  const tezos = useTezos();
  const accountPkh = useAccountPkh();

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

  const walletIsConnected = isExist(accountPkh);
  const stakingStatsStoreReady = (!stakingStatsStoreLoading && stakingStatsStoreInitialized) || !walletIsConnected;
  const itemStoreReady = !itemStoreLoading && itemStoreInitialized;
  const stakingDelegateStoreReady =
    (!stakingDelegateStoreLoading && stakingDelegateStoreInitialized) || !walletIsConnected;
  const stakingLoading = dAppLoading || !stakingStatsStoreReady || !itemStoreReady;
  const delegatesLoading = bakersLoading || stakingLoading || !stakingDelegateStoreReady;

  const handleHarvest = async () => {
    if (!tezos || !accountPkh || !stakeItem) {
      return;
    }

    await harvestAssetsApi(tezos, stakeItem.id.toNumber(), accountPkh);
  };

  if (!stakeItem) {
    return {
      shouldShowCandidate: true,
      stakeItem,
      myDelegate: null,
      delegatesLoading,
      endTimestamp: null,
      myEarnDollarEquivalent: null,
      myShareDollarEquivalent: null,
      stakingLoading,
      timelock: null,
      handleHarvest
    };
  }

  const commonProps = {
    myDelegate: isNull(delegateAddress) ? null : makeBaker(delegateAddress, bakers),
    shouldShowCandidate: canDelegate(stakeItem),
    delegatesLoading,
    stakingLoading,
    timelock: stakeItem.timelock,
    handleHarvest
  };

  if (!stakingStats) {
    return {
      ...commonProps,
      stakeItem,
      endTimestamp: null,
      myEarnDollarEquivalent: null,
      myShareDollarEquivalent: null
    };
  }

  const myEarnDollarEquivalent = getDollarEquivalent(
    fromDecimals(defined(stakingItemStore.earnBalance), stakeItem.rewardToken),
    bigNumberToString(stakeItem.earnExchangeRate)
  );

  const myShareDollarEquivalent = getDollarEquivalent(
    fromDecimals(stakingStats.staked, stakeItem.stakedToken),
    bigNumberToString(stakeItem.depositExchangeRate)
  );

  return {
    ...commonProps,
    stakeItem: {
      ...stakeItem,
      depositBalance: fromDecimals(stakingStats.staked, stakeItem.stakedToken),
      earnBalance: defined(stakingItemStore.earnBalance)
    },
    endTimestamp: new Date(stakingStats.lastStaked).getTime() + Number(stakeItem.timelock) * MS_IN_SECOND,
    myEarnDollarEquivalent,
    myShareDollarEquivalent,
    stakingLoading
  };
};
