import { useCallback, useEffect, useState } from 'react';

import { ZERO_AMOUNT } from '@config/constants';
import { QUIPU_TOKEN, TEZOS_TOKEN } from '@config/tokens';
import { useDoYouvesHarvest, useFarmingYouvesItemStore, useGetYouvesFarmingItem } from '@modules/farming/hooks';
import { useRootStore } from '@providers/root-store-provider';
import { useAccountPkh } from '@providers/use-dapp';
import { getLastElementFromArray, getSymbolsString } from '@shared/helpers';
import { useOnBlock, useToken, useTokenBalance } from '@shared/hooks';
import { amplitudeService } from '@shared/services';

import { getRewardsDueDate } from '../../api/get-rewards-due-date';
import { useYouvesFarmingItemRewards } from './use-youves-rewards';

export const useYouvesRewardInfoViewModel = () => {
  // TODO: remove useState using store
  const [rewadsDueDate, setRewardsDueDate] = useState(ZERO_AMOUNT);
  const { tezos } = useRootStore();
  const { doHarvest } = useDoYouvesHarvest();
  const accountPkh = useAccountPkh();
  const { delayedGetFarmingItem } = useGetYouvesFarmingItem();
  const youvesFarmingItemStore = useFarmingYouvesItemStore();
  const youvesFarmingItem = youvesFarmingItemStore.item;
  const stakedToken = useToken(youvesFarmingItem?.stakedToken ?? null);
  const rewardToken = useToken(youvesFarmingItem?.rewardToken ?? null);
  const earnBalance = useTokenBalance(stakedToken);

  const symbolsString = getSymbolsString([QUIPU_TOKEN, TEZOS_TOKEN]);
  const rewardTokenCurrency = getSymbolsString(youvesFarmingItemStore.item?.rewardToken ?? null);

  const {
    claimableRewards,
    claimablePendingRewardsInUsd,
    longTermRewards,
    longTermPendingRewardsInUsd,
    userTotalDeposit,
    userTotalDepositDollarEquivalent
  } = useYouvesFarmingItemRewards();

  const handleHarvest = async () => {
    // TODO: add real balances, which are important for analytics
    const farmingItemWithBalances = {
      ...youvesFarmingItem!,
      depositBalance: null,
      earnBalance
    };
    amplitudeService.logEvent('YOUVES_HARVEST_CLICK');
    await doHarvest(farmingItemWithBalances, getLastElementFromArray(youvesFarmingItemStore.stakes).id);

    await delayedGetFarmingItem(farmingItemWithBalances.id);
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

  return {
    claimablePendingRewards: claimableRewards,
    longTermPendingRewards: longTermRewards,
    claimablePendingRewardsInUsd,
    longTermPendingRewardsInUsd,
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
    rewadsDueDate
  };
};
