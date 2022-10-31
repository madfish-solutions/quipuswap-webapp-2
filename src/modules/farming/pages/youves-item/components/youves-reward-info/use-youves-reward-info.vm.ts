import { useCallback, useEffect, useState } from 'react';

import BigNumber from 'bignumber.js';

import { ZERO_AMOUNT, ZERO_AMOUNT_BN } from '@config/constants';
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
  const { item: youvesFarmingItem, id } = youvesFarmingItemStore;
  const stakedToken = useToken(youvesFarmingItem?.stakedToken ?? null);
  const rewardToken = useToken(youvesFarmingItem?.rewardToken ?? null);
  const earnBalance = useTokenBalance(stakedToken);

  const symbolsString = getSymbolsString(youvesFarmingItem?.tokens ?? null);
  const rewardTokenCurrency = getSymbolsString(rewardToken ?? null);

  const {
    claimableRewards,
    claimablePendingRewardsInUsd,
    // longTermRewards,
    longTermPendingRewardsInUsd,
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
    await doHarvest(farmingItemWithBalances, getLastElementFromArray(youvesFarmingItemStore.stakes).id);

    await delayedGetFarmingItem(id);
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
    longTermPendingRewards: new BigNumber(1),
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
