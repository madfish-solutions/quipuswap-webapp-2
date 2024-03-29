import { NO_TIMELOCK_VALUE } from '@config/constants';
import { useBakers } from '@providers/dapp-bakers';
import { useAccountPkh, useReady } from '@providers/use-dapp';
import { defined, getTokenSymbol, isExist, isNull, multipliedIfPossible, placeDecimals } from '@shared/helpers';
import { amplitudeService } from '@shared/services';

import { getUserReward } from './get-user-reward.helper';
import { getMinEndTime, getEndTimestamp, getIsHarvestAvailable, getUserInfoLastStakedTime } from '../../../../helpers';
import { useFarmingItemStore, useDoHarvest, useGetFarmingItem } from '../../../../hooks';
import { canDelegate, makeBaker } from '../../helpers';

const TOKEN_SYMBOL_FILLER = '\u00a0';

export const useFarmingRewardInfoViewModel = () => {
  const farmingItemStore = useFarmingItemStore();
  const { itemStore, item, userFarmingDelegateStore, userInfoStore, farmingItem } = farmingItemStore;
  const accountPkh = useAccountPkh();

  const { delayedGetFarmingItem } = useGetFarmingItem();
  const { doHarvest } = useDoHarvest();
  const { data: bakers, loading: bakersLoading } = useBakers();
  const dAppReady = useReady();
  const userInfo = farmingItemStore.userInfo;

  const walletIsConnected = isExist(accountPkh);
  const userInfoStoreReady = userInfoStore.isReady || !walletIsConnected;
  const itemStoreReady = itemStore.isReady;
  const farmingDelegateStoreReady = userFarmingDelegateStore.isReady || !walletIsConnected;
  const pendingRewardsReady = isExist(farmingItem?.earnBalance) || !walletIsConnected;
  const farmingLoading = !dAppReady || !userInfoStoreReady || !itemStoreReady || !pendingRewardsReady;
  const delegatesLoading = bakersLoading || farmingLoading || !farmingDelegateStoreReady;
  const delegateAddress = farmingItemStore.userFarmingDelegateAddress;

  const handleHarvest = async () => {
    amplitudeService.logEvent('HARVEST_CLICK');
    await doHarvest(defined(farmingItem, 'farmingItem'));

    await delayedGetFarmingItem(defined(farmingItem, 'farmingItem').id, defined(farmingItem, 'farmingItem').version);
  };

  if (!farmingItem) {
    return {
      shouldShowCandidate: true,
      farmingItem,
      endTime: null,
      myDelegate: null,
      delegatesLoading,
      endTimestamp: null,
      myReward: null,
      myRewardInUsd: null,
      myDepositDollarEquivalent: null,
      rewardTokenSymbol: TOKEN_SYMBOL_FILLER,
      rewardTokenDecimals: 0,
      farmingLoading,
      shouldShowCountdown: false,
      shouldShowCountdownValue: false,
      isHarvestAvailable: false,
      handleHarvest
    };
  }

  const myDepositDollarEquivalent = multipliedIfPossible(farmingItem.depositBalance, farmingItem.depositExchangeRate);
  const myRewardInAtomic = farmingItem.earnBalance
    ? placeDecimals(farmingItem.earnBalance, farmingItem.stakedToken.metadata.decimals)
    : null;
  const myReward = getUserReward(myRewardInAtomic, item?.harvestFee);
  const myRewardInUsd = multipliedIfPossible(myReward, farmingItem.earnExchangeRate);

  // TODO: Move to the model
  const shouldShowCountdown = farmingItem.timelock !== NO_TIMELOCK_VALUE;
  const shouldShowCountdownValue = farmingItem.depositBalance ? !farmingItem.depositBalance.isZero() : false;
  const lastStakedTime = getUserInfoLastStakedTime(userInfo);
  const endTime = farmingItem.endTime;
  const endTimestamp = getEndTimestamp(farmingItem, lastStakedTime);
  const minEndTime = getMinEndTime(endTime, endTimestamp);
  const isHarvestAvailable = getIsHarvestAvailable(minEndTime);

  return {
    shouldShowCandidate: canDelegate(farmingItem),
    farmingItem,
    endTime: minEndTime ?? Number(NO_TIMELOCK_VALUE),
    myDelegate: isNull(delegateAddress) ? null : makeBaker(delegateAddress, bakers),
    delegatesLoading,
    endTimestamp,
    myReward,
    myRewardInUsd,
    myDepositDollarEquivalent,
    rewardTokenSymbol: getTokenSymbol(farmingItem.rewardToken),
    rewardTokenDecimals: farmingItem.rewardToken.metadata.decimals,
    farmingLoading,
    shouldShowCountdown,
    shouldShowCountdownValue,
    isHarvestAvailable,
    handleHarvest
  };
};
