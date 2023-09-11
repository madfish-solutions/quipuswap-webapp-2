import { useCallback, useEffect, useState } from 'react';

import { ZERO_AMOUNT, ZERO_AMOUNT_BN } from '@config/constants';
import { useDoYouvesHarvest, useFarmingYouvesItemStore, useGetYouvesFarmingItem } from '@modules/farming/hooks';
import { useRootStore } from '@providers/root-store-provider';
import { useAccountPkh } from '@providers/use-dapp';
import { defined, executeAsyncSteps, getLastElementFromArray, getSymbolsString } from '@shared/helpers';
import { useMount, useOnBlock, useToken, useTokenBalance } from '@shared/hooks';
import { amplitudeService } from '@shared/services';

import { useYouvesHarvestConfirmationPopup } from './use-youves-harvest-confirmation-popup';
import { useYouvesFarmingItemRewards } from './use-youves-rewards';
import { getRewardsDueDate } from '../../api';

export const useYouvesRewardInfoViewModel = () => {
  // TODO: remove useState using store
  const [rewardsDueDate, setRewardsDueDate] = useState(ZERO_AMOUNT);
  const { tezos } = useRootStore();
  const { doHarvest } = useDoYouvesHarvest();
  const accountPkh = useAccountPkh();
  const { delayedGetFarmingItem } = useGetYouvesFarmingItem();
  const youvesFarmingItemStore = useFarmingYouvesItemStore();
  const { item: youvesFarmingItem, id, version } = youvesFarmingItemStore;
  const stakedToken = useToken(youvesFarmingItem?.stakedToken ?? null);
  const rewardToken = useToken(youvesFarmingItem?.rewardToken ?? null);
  const earnBalance = useTokenBalance(stakedToken);

  const confirmationPopup = useYouvesHarvestConfirmationPopup();
  const { isNextStepsRelevant } = useMount();

  const symbolsString = getSymbolsString(youvesFarmingItem?.tokens ?? null);
  const rewardTokenCurrency = getSymbolsString(rewardToken ?? null);

  const {
    claimablePendingRewards,
    longTermPendingRewards,
    claimablePendingRewardsInUsd,
    longTermPendingRewardsInUsd,
    claimableRewardsLoading,
    longTermRewardsLoading,
    userTotalDeposit,
    userTotalDepositDollarEquivalent
  } = useYouvesFarmingItemRewards();

  const handleHarvest = async () => {
    // TODO: add real balances, which are important for analytics
    const farmingItemWithBalances = {
      ...youvesFarmingItem!,
      depositBalance: youvesFarmingItemStore.currentStake?.stake ?? ZERO_AMOUNT_BN,
      earnBalance
    };
    amplitudeService.logEvent('YOUVES_HARVEST_CLICK');
    confirmationPopup(async () => {
      await executeAsyncSteps(
        [
          async () =>
            await doHarvest(farmingItemWithBalances, getLastElementFromArray(youvesFarmingItemStore.stakes).id),
          async () => await delayedGetFarmingItem(id, defined(version, 'version'))
        ],
        isNextStepsRelevant
      );
    }, rewardsDueDate);
  };

  const getUserStakeInfo = useCallback(async () => {
    if (!youvesFarmingItem) {
      setRewardsDueDate(ZERO_AMOUNT);

      return;
    }

    const dueDate = await getRewardsDueDate(tezos, accountPkh, youvesFarmingItem.contractAddress);
    setRewardsDueDate(dueDate);
  }, [accountPkh, tezos, youvesFarmingItem]);

  useEffect(() => {
    getUserStakeInfo();
  }, [getUserStakeInfo]);

  useOnBlock(getUserStakeInfo);

  // TODO: https://madfish.atlassian.net/browse/QUIPU-636
  const isBlocked = youvesFarmingItem?.contractAddress === 'KT1Mb9PJYb2XME6nkepFRUGGdo2xedkBNe7z';

  return {
    isBlocked,
    claimablePendingRewards,
    longTermPendingRewards,
    claimablePendingRewardsInUsd,
    longTermPendingRewardsInUsd,
    claimableRewardsLoading,
    longTermRewardsLoading,
    shouldShowCountdown: true,
    shouldShowCountdownValue: true,
    farmingLoading: false,
    rewardTokenDecimals: rewardToken?.metadata.decimals ?? ZERO_AMOUNT,
    handleHarvest,
    isHarvestAvailable: true,
    symbolsString,
    userTotalDeposit,
    rewardTokenCurrency,
    userTotalDepositDollarEquivalent,
    rewardsDueDate
  };
};
