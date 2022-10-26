import { useCallback, useEffect, useMemo, useState } from 'react';

import { ZERO_AMOUNT, ZERO_AMOUNT_BN } from '@config/constants';
import { QUIPU_TOKEN, TEZOS_TOKEN } from '@config/tokens';
import { useDoYouvesHarvest, useFarmingYouvesItemStore, useGetYouvesFarmingItem } from '@modules/farming/hooks';
import { useRootStore } from '@providers/root-store-provider';
import { useAccountPkh } from '@providers/use-dapp';
import { getLastElementFromArray, getSymbolsString } from '@shared/helpers';
import { useOnBlock, useToken, useTokenBalance } from '@shared/hooks';
import { amplitudeService } from '@shared/services';

import { getRewardsDueDate } from '../../api/get-rewards-due-date';
import { getTotalDeposit } from '../../api/get-total-deposit';

export const useYouvesRewardInfoViewModel = () => {
  // TODO: remove useState when store will be ready
  const [userTotalDeposit, setTotalDeposit] = useState(ZERO_AMOUNT_BN);
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
  const { claimableRewards, longTermRewards } = youvesFarmingItemStore;

  const symbolsString = getSymbolsString([QUIPU_TOKEN, TEZOS_TOKEN]);
  const rewardTokenCurrency = getSymbolsString(youvesFarmingItemStore.item?.rewardToken ?? null);

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
      setTotalDeposit(ZERO_AMOUNT_BN);

      return;
    }

    const dueDate = await getRewardsDueDate(tezos, accountPkh, youvesFarmingItem.contractAddress);
    setRewardsDueDate(dueDate);
    const totalDeposit = await getTotalDeposit(tezos, accountPkh, youvesFarmingItem.contractAddress);
    setTotalDeposit(totalDeposit);
  }, [accountPkh, tezos, youvesFarmingItem]);

  const userTotalDepositDollarEquivalent = useMemo(
    () => userTotalDeposit.times(youvesFarmingItem?.depositExchangeRate ?? ZERO_AMOUNT_BN) ?? null,
    [userTotalDeposit, youvesFarmingItem]
  );

  useEffect(() => {
    getUserStakeInfo();
  }, [getUserStakeInfo]);

  useOnBlock(getUserStakeInfo);

  return {
    claimablePendingRewards: claimableRewards,
    longTermPendingRewards: longTermRewards,
    claimablePendingRewardsInUsd: youvesFarmingItemStore.claimableRewardsInUsd,
    longTermPendingRewardsInUsd: youvesFarmingItemStore.longTermRewardsInUsd,
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
