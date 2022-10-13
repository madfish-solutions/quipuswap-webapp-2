import BigNumber from 'bignumber.js';

import { QUIPU_TOKEN, TEZOS_TOKEN } from '@config/tokens';
import { getSymbolsString } from '@shared/helpers';

export const useYouvesRewardInfoViewModel = () => {
  const symbolsString = getSymbolsString([QUIPU_TOKEN, TEZOS_TOKEN]);

  const handleHarvest = () => {
    // eslint-disable-next-line no-console
    console.log('click');
  };

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
    symbolsString
  };
};
