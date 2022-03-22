import { MS_IN_SECOND } from '@app.config';
import { useDoHarvest } from '@containers/farming/hooks/use-do-harvest';
import { useGetFarmingItem } from '@containers/farming/hooks/use-get-farming-item';
import { useFarmingItemStore } from '@hooks/stores/use-farming-item-store';
import { useAccountPkh, useBakers, useReady } from '@utils/dapp';
import { defined, getDollarEquivalent, getTokenSymbol, isExist, isNull } from '@utils/helpers';

import { canDelegate, makeBaker } from '../../helpers';

const TOKEN_SYMBOL_FILLER = '\u00a0';

export const useFarmingRewardInfoViewModel = () => {
  const farmingItemStore = useFarmingItemStore();
  const { itemStore, userStakingDelegateStore, lastStakedTimeStore } = farmingItemStore;
  const accountPkh = useAccountPkh();

  const { delayedGetFarmingItem } = useGetFarmingItem();
  const { doHarvest } = useDoHarvest();
  const { data: bakers, loading: bakersLoading } = useBakers();
  const dAppReady = useReady();
  const {
    data: lastStakedTime,
    isLoading: lastStakedTimeLoading,
    isInitialized: stakingStatsStoreInitialized
  } = lastStakedTimeStore;
  const { data: farmingItem, isLoading: itemStoreLoading, isInitialized: itemStoreInitialized } = itemStore;
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
    await doHarvest(farmingItem);

    await delayedGetFarmingItem(defined(farmingItem).id);
  };

  if (!farmingItem) {
    return {
      shouldShowCandidate: true,
      farmingItem,
      myDelegate: null,
      delegatesLoading,
      endTimestamp: null,
      myRewardInTokens: null,
      myDepositDollarEquivalent: null,
      rewardTokenSymbol: TOKEN_SYMBOL_FILLER,
      rewardTokenDecimals: 0,
      stakingLoading,
      timelock: null,
      handleHarvest
    };
  }

  const myDepositDollarEquivalent = getDollarEquivalent(farmingItem.depositBalance, farmingItem.depositExchangeRate);

  return {
    shouldShowCandidate: canDelegate(farmingItem),
    farmingItem,
    myDelegate: isNull(delegateAddress) ? null : makeBaker(delegateAddress, bakers),
    delegatesLoading,
    endTimestamp: isExist(lastStakedTime) ? lastStakedTime + Number(farmingItem.timelock) * MS_IN_SECOND : null,
    myRewardInTokens: farmingItem.earnBalance?.decimalPlaces(farmingItem.stakedToken.metadata.decimals) ?? null,
    myDepositDollarEquivalent,
    rewardTokenSymbol: getTokenSymbol(farmingItem.rewardToken),
    rewardTokenDecimals: farmingItem.rewardToken.metadata.decimals,
    stakingLoading,
    timelock: farmingItem.timelock,
    handleHarvest
  };
};
