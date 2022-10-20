import { useCallback, useEffect, useState } from 'react';

import BigNumber from 'bignumber.js';

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
  const [userTotalDeposit, setTotalDeposit] = useState(new BigNumber(0));
  const [rewadsDueDate, setRewardsDueDate] = useState(0);
  const { tezos } = useRootStore();
  const { doHarvest } = useDoYouvesHarvest();
  const accountPkh = useAccountPkh();
  const { delayedGetFarmingItem } = useGetYouvesFarmingItem();
  const youvesFarmingItemStore = useFarmingYouvesItemStore();
  const youvesFarmingItem = youvesFarmingItemStore.item;
  const stakedToken = useToken(youvesFarmingItem?.stakedToken ?? null);
  const earnBalance = useTokenBalance(stakedToken);

  const symbolsString = getSymbolsString([QUIPU_TOKEN, TEZOS_TOKEN]);

  const handleHarvest = async () => {
    // TODO: add real balances, which are important for analytics
    const farmingItemWithBalances = {
      ...youvesFarmingItem!,
      depositBalance: null,
      earnBalance
    };
    amplitudeService.logEvent('YOUVES_HARVEST_CLICK');
    await doHarvest(farmingItemWithBalances, getLastElementFromArray(youvesFarmingItemStore.stakes).id);

    await delayedGetFarmingItem(farmingItemWithBalances.address);
  };

  const getUserStakeInfo = useCallback(async () => {
    if (!youvesFarmingItem) {
      setRewardsDueDate(0);
      setTotalDeposit(new BigNumber(0));

      return;
    }

    const dueDate = await getRewardsDueDate(tezos, accountPkh, youvesFarmingItem.address);
    setRewardsDueDate(dueDate);
    const totalDeposit = await getTotalDeposit(tezos, accountPkh, youvesFarmingItem.address);
    setTotalDeposit(totalDeposit);
  }, [accountPkh, tezos, youvesFarmingItem]);

  useEffect(() => {
    getUserStakeInfo();
  }, [getUserStakeInfo]);

  useOnBlock(getUserStakeInfo);

  return {
    claimablePendingRewards: new BigNumber(1000),
    longTermPendingRewards: new BigNumber(1000),
    claimablePendingRewardsInUsd: new BigNumber(1500),
    shouldShowCountdown: true,
    shouldShowCountdownValue: true,
    timestamp: 10000,
    farmingLoading: false,
    rewardTokenDecimals: 6,
    handleHarvest,
    isHarvestAvailable: true,
    symbolsString,
    userTotalDeposit,
    userTotalDepositDollarEquivalent: new BigNumber(150),
    rewadsDueDate
  };
};
