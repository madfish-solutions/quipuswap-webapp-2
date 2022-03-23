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
  const { itemStore, userStakingDelegateStore, userInfoStore, farmingItem } = farmingItemStore;
  const accountPkh = useAccountPkh();

  const { delayedGetFarmingItem } = useGetFarmingItem();
  const { doHarvest } = useDoHarvest();
  const { data: bakers, loading: bakersLoading } = useBakers();
  const dAppReady = useReady();
  const { data: userInfo } = userInfoStore;
  const { data: delegateAddress } = userStakingDelegateStore;

  const walletIsConnected = isExist(accountPkh);
  const userInfoStoreReady = userInfoStore.isReady || !walletIsConnected;
  const itemStoreReady = itemStore.isReady;
  const stakingDelegateStoreReady = userStakingDelegateStore.isReady || !walletIsConnected;
  const pendingRewardsReady = isExist(farmingItem?.earnBalance) || !walletIsConnected;
  const stakingLoading = !dAppReady || !userInfoStoreReady || !itemStoreReady || !pendingRewardsReady;
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
      myRewardInUsd: null,
      myDepositDollarEquivalent: null,
      rewardTokenSymbol: TOKEN_SYMBOL_FILLER,
      rewardTokenDecimals: 0,
      stakingLoading,
      timelock: null,
      handleHarvest
    };
  }

  const myDepositDollarEquivalent = getDollarEquivalent(farmingItem.depositBalance, farmingItem.depositExchangeRate);
  const lastStakedTime = userInfo ? new Date(userInfo.last_staked).getTime() : null;
  const myRewardInTokens = farmingItem.earnBalance?.decimalPlaces(farmingItem.stakedToken.metadata.decimals) ?? null;
  const myRewardInUsd = getDollarEquivalent(myRewardInTokens, farmingItem.earnExchangeRate);

  return {
    shouldShowCandidate: canDelegate(farmingItem),
    farmingItem,
    myDelegate: isNull(delegateAddress) ? null : makeBaker(delegateAddress, bakers),
    delegatesLoading,
    endTimestamp: isExist(lastStakedTime) ? lastStakedTime + Number(farmingItem.timelock) * MS_IN_SECOND : null,
    myRewardInTokens,
    myRewardInUsd,
    myDepositDollarEquivalent,
    rewardTokenSymbol: getTokenSymbol(farmingItem.rewardToken),
    rewardTokenDecimals: farmingItem.rewardToken.metadata.decimals,
    stakingLoading,
    timelock: farmingItem.timelock,
    handleHarvest
  };
};
