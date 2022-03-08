import { MS_IN_SECOND } from '@app.config';
import { useDoHarvest } from '@containers/staking/hooks/use-do-harvest';
import { useStakingItemStore } from '@hooks/stores/use-staking-item-store';
import { useBakers, useIsLoading } from '@utils/dapp';
import { bigNumberToString, getDollarEquivalent } from '@utils/helpers';

import { canDelegate, makeBaker } from '../../helpers';

const mockLastStaked = Date.now();
// eslint-disable-next-line
const mockMyDelegateAddress: string = 'tz2XdXvVTgrBzZkBHtDiEWgfrgJXu33rkcJN';

export const useStakingRewardInfoViewModel = () => {
  const { doHarvest } = useDoHarvest();
  const stakingItemStore = useStakingItemStore();
  const { data: bakers, loading: bakersLoading } = useBakers();
  const dAppLoading = useIsLoading();
  const { data: stakeItem, isLoading: dataLoading, isInitialized: dataInitialized } = stakingItemStore.itemStore;
  const stakingLoading = dataLoading || !dataInitialized || dAppLoading;
  const delegatesLoading = bakersLoading || stakingLoading;

  const handleHarvest = async () => {
    return await doHarvest(stakeItem);
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

  const myEarnDollarEquivalent = getDollarEquivalent(
    stakeItem.earnBalance,
    bigNumberToString(stakeItem.earnExchangeRate)
  );

  return {
    shouldShowCandidate: canDelegate(stakeItem),
    stakeItem,
    myDelegate: makeBaker(mockMyDelegateAddress, bakers),
    delegatesLoading,
    endTimestamp: mockLastStaked + Number(stakeItem.timelock) * MS_IN_SECOND,
    myEarnDollarEquivalent,
    stakingLoading,
    timelock: stakeItem.timelock,
    handleHarvest
  };
};
