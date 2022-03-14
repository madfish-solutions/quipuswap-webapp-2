import BigNumber from 'bignumber.js';

import { MS_IN_SECOND } from '@app.config';
import { useDoHarvest } from '@containers/staking/hooks/use-do-harvest';
import { useGetStakingItem } from '@containers/staking/hooks/use-get-staking-item';
import { useStakingItemStore } from '@hooks/stores/use-staking-item-store';
import { useBakers, useReady } from '@utils/dapp';
import { defined, getDollarEquivalent } from '@utils/helpers';

import { canDelegate, makeBaker } from '../../helpers';

const mockLastStaked = Date.now();
// eslint-disable-next-line
const mockMyDelegateAddress: string = 'tz2XdXvVTgrBzZkBHtDiEWgfrgJXu33rkcJN';

export const useStakingRewardInfoViewModel = () => {
  const stakingItemStore = useStakingItemStore();
  const { delayedGetStakingItem } = useGetStakingItem();
  const { doHarvest } = useDoHarvest();
  const { data: bakers, loading: bakersLoading } = useBakers();
  const dAppReady = useReady();
  const { data: stakeItem, isLoading: dataLoading, isInitialized: dataInitialized } = stakingItemStore.itemStore;
  const stakingLoading = dataLoading || !dataInitialized || !dAppReady;
  const delegatesLoading = bakersLoading || stakingLoading;

  const handleHarvest = async () => {
    await doHarvest(stakeItem);

    await delayedGetStakingItem(defined(stakeItem).id);
  };

  if (!stakeItem) {
    return {
      shouldShowCandidate: true,
      stakeItem,
      myDelegate: null,
      delegatesLoading,
      endTimestamp: null,
      myEarnDollarEquivalent: null,
      stakingLoading,
      timelock: null,
      handleHarvest
    };
  }

  const myEarnDollarEquivalent = getDollarEquivalent(stakeItem.earnBalance, stakeItem.earnExchangeRate);
  const myDepositDollarEquivalent = getDollarEquivalent(stakeItem.depositBalance, stakeItem.depositExchangeRate);

  return {
    shouldShowCandidate: canDelegate(stakeItem),
    stakeItem,
    myDelegate: makeBaker(mockMyDelegateAddress, bakers),
    delegatesLoading,
    endTimestamp: mockLastStaked + Number(stakeItem.timelock) * MS_IN_SECOND,
    myDepositDollarEquivalent,
    myEarnDollarEquivalent: myEarnDollarEquivalent ? new BigNumber(myEarnDollarEquivalent) : null,
    stakingLoading,
    timelock: stakeItem.timelock,
    handleHarvest
  };
};
