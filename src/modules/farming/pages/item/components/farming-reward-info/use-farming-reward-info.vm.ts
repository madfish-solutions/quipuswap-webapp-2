import { useCallback } from 'react';

import { NO_TIMELOCK_VALUE } from '@config/constants';
import { DEFAULT_TOKEN } from '@config/tokens';
import { useBakers } from '@providers/dapp-bakers';
import { useAccountPkh, useReady } from '@providers/use-dapp';
import { defined, getTokenSymbol, isExist, isNull, multipliedIfPossible, isTokenEqual } from '@shared/helpers';

import { getEndTimestamp, getIsHarvestAvailable, getUserInfoLastStakedTime } from '../../../../helpers';
import {
  useFarmingItemStore,
  useDoHarvestAndRestake,
  useHarvestConfirmationPopup,
  useDoHarvest,
  useGetFarmingItem
} from '../../../../hooks';
import { canDelegate, makeBaker } from '../../helpers';

const TOKEN_SYMBOL_FILLER = '\u00a0';

export const useFarmingRewardInfoViewModel = () => {
  const confirmationPopup = useHarvestConfirmationPopup();
  const farmingItemStore = useFarmingItemStore();
  const { itemStore, userFarmingDelegateStore, userInfoStore, farmingItem } = farmingItemStore;
  const accountPkh = useAccountPkh();

  const { delayedGetFarmingItem } = useGetFarmingItem();
  const { doHarvest } = useDoHarvest();
  const { doHarvestAndRestake } = useDoHarvestAndRestake();
  const { data: bakers, loading: bakersLoading } = useBakers();
  const dAppReady = useReady();
  const { data: userInfo } = userInfoStore;
  const { data: delegateAddress } = userFarmingDelegateStore;

  const walletIsConnected = isExist(accountPkh);
  const userInfoStoreReady = userInfoStore.isReady || !walletIsConnected;
  const itemStoreReady = itemStore.isReady;
  const farmingDelegateStoreReady = userFarmingDelegateStore.isReady || !walletIsConnected;
  const pendingRewardsReady = isExist(farmingItem?.earnBalance) || !walletIsConnected;
  const farmingLoading = !dAppReady || !userInfoStoreReady || !itemStoreReady || !pendingRewardsReady;
  const delegatesLoading = bakersLoading || farmingLoading || !farmingDelegateStoreReady;

  const doSimpleHarvest = useCallback(async () => {
    await doHarvest(defined(farmingItem));

    await delayedGetFarmingItem(defined(farmingItem).id);
  }, [delayedGetFarmingItem, doHarvest, farmingItem]);

  const handleHarvest = async () => {
    const pendingRewardsOnCurrentBlock = await farmingItemStore.getPendingRewardsOnCurrentBlock();

    if (isTokenEqual(defined(farmingItem).rewardToken, DEFAULT_TOKEN)) {
      const yesCallback = async () => {
        await doHarvestAndRestake(farmingItem, pendingRewardsOnCurrentBlock);

        await delayedGetFarmingItem(defined(farmingItem).id);
      };

      confirmationPopup(yesCallback, doSimpleHarvest);
    } else {
      await doSimpleHarvest();
    }
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
      farmingLoading,
      shouldShowCountdown: false,
      shouldShowCountdownValue: false,
      isHarvestAvailable: false,
      handleHarvest
    };
  }

  const myDepositDollarEquivalent = multipliedIfPossible(farmingItem.depositBalance, farmingItem.depositExchangeRate);
  const myRewardInTokens = farmingItem.earnBalance?.decimalPlaces(farmingItem.stakedToken.metadata.decimals) ?? null;
  const myRewardInUsd = multipliedIfPossible(myRewardInTokens, farmingItem.earnExchangeRate);

  // TODO: Move to the model
  const shouldShowCountdown = farmingItem.timelock !== NO_TIMELOCK_VALUE;
  const shouldShowCountdownValue = farmingItem.depositBalance ? !farmingItem.depositBalance.isZero() : false;
  const lastStakedTime = getUserInfoLastStakedTime(userInfo);
  const endTimestamp = getEndTimestamp(farmingItem, lastStakedTime);
  const isHarvestAvailable = getIsHarvestAvailable(endTimestamp);

  return {
    shouldShowCandidate: canDelegate(farmingItem),
    farmingItem,
    myDelegate: isNull(delegateAddress) ? null : makeBaker(delegateAddress, bakers),
    delegatesLoading,
    endTimestamp,
    myRewardInTokens,
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
