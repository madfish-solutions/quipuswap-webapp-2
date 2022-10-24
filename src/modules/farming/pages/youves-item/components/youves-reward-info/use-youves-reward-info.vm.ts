import { useCallback, useEffect, useState } from 'react';

import BigNumber from 'bignumber.js';
import { useParams } from 'react-router-dom';

import { ZERO_AMOUNT } from '@config/constants';
import { QUIPU_TOKEN, TEZOS_TOKEN } from '@config/tokens';
import { useRootStore } from '@providers/root-store-provider';
import { useAccountPkh } from '@providers/use-dapp';
import { getSymbolsString } from '@shared/helpers';
import { useOnBlock } from '@shared/hooks';

import { getUserRewards } from '../../api';
import { getRewardsDueDate } from '../../api/get-rewards-due-date';
import { getTotalDeposit } from '../../api/get-total-deposit';

const DEFAULT_REWARDS = {
  claimable_reward: new BigNumber(ZERO_AMOUNT),
  full_reward: new BigNumber(ZERO_AMOUNT)
};

export const useYouvesRewardInfoViewModel = () => {
  // TODO: remove useState when store will be ready
  const [userTotalDeposit, setTotalDeposit] = useState(new BigNumber(0));
  const [rewadsDueDate, setRewardsDueDate] = useState(0);
  const [rewards, setRewards] = useState(DEFAULT_REWARDS);
  const { tezos } = useRootStore();
  const { contractAddress } = useParams();
  const accountPkh = useAccountPkh();

  const symbolsString = getSymbolsString([QUIPU_TOKEN, TEZOS_TOKEN]);

  const handleHarvest = () => {
    // eslint-disable-next-line no-console
    console.log('click');
  };

  const getUserStakeInfo = useCallback(async () => {
    const userRewards = await getUserRewards(tezos, accountPkh, contractAddress);
    setRewards(userRewards);
    const dueDate = await getRewardsDueDate(tezos, accountPkh, contractAddress);
    setRewardsDueDate(dueDate);
    const totalDeposit = await getTotalDeposit(tezos, accountPkh, contractAddress);
    setTotalDeposit(totalDeposit);
  }, [accountPkh, contractAddress, tezos]);

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
