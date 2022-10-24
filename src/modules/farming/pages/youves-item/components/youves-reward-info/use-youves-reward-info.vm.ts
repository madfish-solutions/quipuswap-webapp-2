import { useCallback, useEffect, useState } from 'react';

import BigNumber from 'bignumber.js';
import { useParams } from 'react-router-dom';


import { ZERO_AMOUNT, ZERO_AMOUNT_BN } from '@config/constants';
import { QUIPU_TOKEN, TEZOS_TOKEN } from '@config/tokens';
import { useDoYouvesHarvest, useFarmingYouvesItemStore, useGetYouvesFarmingItem } from '@modules/farming/hooks';
import { useRootStore } from '@providers/root-store-provider';
import { useAccountPkh } from '@providers/use-dapp';
import { getLastElementFromArray, getSymbolsString } from '@shared/helpers';
import { useOnBlock, useToken, useTokenBalance } from '@shared/hooks';
import { amplitudeService } from '@shared/services';

import { getUserRewards } from '../../api';
import { getRewardsDueDate } from '../../api/get-rewards-due-date';
import { getTotalDeposit } from '../../api/get-total-deposit';

const DEFAULT_REWARDS = {
  claimable_reward: new BigNumber(ZERO_AMOUNT),
  full_reward: new BigNumber(ZERO_AMOUNT)
};

export const useYouvesRewardInfoViewModel = () => {
  // TODO: remove useState when store will be ready
  const [userTotalDeposit, setTotalDeposit] = useState(ZERO_AMOUNT_BN);
  const [rewadsDueDate, setRewardsDueDate] = useState(ZERO_AMOUNT);
  const [rewards, setRewards] = useState(DEFAULT_REWARDS);
  const { tezos } = useRootStore();
  const { contractAddress } = useParams();
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
      setRewardsDueDate(ZERO_AMOUNT);
      setTotalDeposit(ZERO_AMOUNT_BN);
      setRewards(DEFAULT_REWARDS);

      return;
    }
    
    const userRewards = await getUserRewards(tezos, accountPkh, contractAddress);
    setRewards(userRewards);
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
    claimablePendingRewards: rewards.claimable_reward,
    longTermPendingRewards: rewards.full_reward,
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
