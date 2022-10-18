import { useEffect, useState } from 'react';

import BigNumber from 'bignumber.js';

import { QUIPU_TOKEN, TEZOS_TOKEN } from '@config/tokens';
import { useRootStore } from '@providers/root-store-provider';
import { useAccountPkh } from '@providers/use-dapp';
import { getSymbolsString } from '@shared/helpers';

import { getRewardsDueDate } from '../../api/get-rewards-due-date';
import { getTotalDeposit } from '../../api/get-total-deposit';

const contractAddress = 'KT1HgM6FFoc841E8CzwpbP3RzBsoskSQyX8B';

export const useYouvesRewardInfoViewModel = () => {
  // TODO: remove useState when store will be ready
  const [userTotalDeposit, setTotalDeposit] = useState(new BigNumber(0));
  const [rewadsDueDate, setRewardsDueDate] = useState(0);
  const { tezos } = useRootStore();
  const accountPkh = useAccountPkh();

  const symbolsString = getSymbolsString([QUIPU_TOKEN, TEZOS_TOKEN]);

  const handleHarvest = () => {
    // eslint-disable-next-line no-console
    console.log('click');
  };

  useEffect(() => {
    (async () => {
      const dueDate = await getRewardsDueDate(tezos, accountPkh, contractAddress);
      setRewardsDueDate(dueDate);
      const totalDeposit = await getTotalDeposit(tezos, accountPkh, contractAddress);
      setTotalDeposit(totalDeposit);
    })();
  }, [accountPkh, tezos]);

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
