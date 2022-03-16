import { MS_IN_SECOND } from '@app.config';
import { useDoHarvest } from '@containers/staking/hooks/use-do-harvest';
import { useGetStakingItem } from '@containers/staking/hooks/use-get-staking-item';
import { useStakingItemStore } from '@hooks/stores/use-staking-item-store';
import { useAccountPkh, useBakers, useReady } from '@utils/dapp';
import { defined, getDollarEquivalent, getTokenSymbol, isExist, isNull } from '@utils/helpers';

import { canDelegate, makeBaker } from '../../helpers';

const TOKEN_SYMBOL_FILLER = '\u00a0';

export const useStakingRewardInfoViewModel = () => {
  const stakingItemStore = useStakingItemStore();
  const { itemStore, userStakingDelegateStore, lastStakedTimeStore } = stakingItemStore;
  const accountPkh = useAccountPkh();

  const { delayedGetStakingItem } = useGetStakingItem();
  const { doHarvest } = useDoHarvest();
  const { data: bakers, loading: bakersLoading } = useBakers();
  const dAppReady = useReady();
  const {
    data: lastStakedTime,
    isLoading: lastStakedTimeLoading,
    isInitialized: stakingStatsStoreInitialized
  } = lastStakedTimeStore;
  const { data: stakeItem, isLoading: itemStoreLoading, isInitialized: itemStoreInitialized } = itemStore;
  const {
    data: delegateAddress,
    isLoading: stakingDelegateStoreLoading,
    isInitialized: stakingDelegateStoreInitialized
  } = userStakingDelegateStore;

  const walletIsConnected = isExist(accountPkh);
  const stakingStatsStoreReady = (!lastStakedTimeLoading && stakingStatsStoreInitialized) || !walletIsConnected;
  const itemStoreReady = !itemStoreLoading && itemStoreInitialized;
  const stakingDelegateStoreReady =
    (!stakingDelegateStoreLoading && stakingDelegateStoreInitialized) || !walletIsConnected;
  const stakingLoading = !dAppReady || !stakingStatsStoreReady || !itemStoreReady;
  const delegatesLoading = bakersLoading || stakingLoading || !stakingDelegateStoreReady;

  const handleHarvest = async () => {
    await doHarvest(stakeItem);

    await delayedGetStakingItem(defined(stakeItem).id);
  };

  if (!stakeItem) {
    return {
      shouldShowCandidate: true,
      stakeItem,
      myDelegate: null,
      delegatesLoading,
      endTimestamp: null,
      myRewardInTokens: null,
      myDepositDollarEquivalent: null,
      rewardTokenSymbol: TOKEN_SYMBOL_FILLER,
      stakingLoading,
      timelock: null,
      handleHarvest
    };
  }

  const myDepositDollarEquivalent = getDollarEquivalent(stakeItem.depositBalance, stakeItem.depositExchangeRate);

  return {
    shouldShowCandidate: canDelegate(stakeItem),
    stakeItem,
    myDelegate: isNull(delegateAddress) ? null : makeBaker(delegateAddress, bakers),
    delegatesLoading,
    endTimestamp: isExist(lastStakedTime) ? lastStakedTime + Number(stakeItem.timelock) * MS_IN_SECOND : null,
    myRewardInTokens: stakeItem.earnBalance?.decimalPlaces(stakeItem.stakedToken.metadata.decimals) ?? null,
    myDepositDollarEquivalent,
    rewardTokenSymbol: stakeItem ? getTokenSymbol(stakeItem.rewardToken) : TOKEN_SYMBOL_FILLER,
    stakingLoading,
    timelock: stakeItem.timelock,
    handleHarvest
  };
};
