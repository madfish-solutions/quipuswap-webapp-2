import { harvestAssetsApi } from '@api/staking/harvest-assets.api';
import { MS_IN_SECOND } from '@app.config';
import { useStakingItemStore } from '@hooks/stores/use-staking-item-store';
import { useBakers, useIsLoading, useAccountPkh, useTezos } from '@utils/dapp';
import { bigNumberToString, getDollarEquivalent } from '@utils/helpers';

import { makeBaker } from '../helpers';

const mockLastStaked = Date.now();
// eslint-disable-next-line
const mockMyDelegateAddress: string = 'tz2XdXvVTgrBzZkBHtDiEWgfrgJXu33rkcJN';

export const useStakingRewardInfoViewModel = () => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();
  const stakingItemStore = useStakingItemStore();
  const { data: bakers, loading: bakersLoading } = useBakers();
  const dAppLoading = useIsLoading();
  const { data: stakeItem, isLoading: dataLoading, isInitialized: dataInitialized } = stakingItemStore.itemStore;
  const stakingLoading = dataLoading || !dataInitialized || dAppLoading;
  const delegatesLoading = bakersLoading || stakingLoading;

  const handleHarvest = () => {
    if (!tezos || !accountPkh || !stakeItem) {
      return;
    }

    harvestAssetsApi(tezos, stakeItem.id.toNumber(), accountPkh);
  };

  if (!stakeItem) {
    return {
      stakeItem,
      myDelegate: null,
      delegatesLoading,
      endTimestamp: null,
      myEarnDollarEquivalent: null,
      stakingLoading,
      handleHarvest
    };
  }

  const myEarnDollarEquivalent = getDollarEquivalent(
    stakeItem.earnBalance,
    bigNumberToString(stakeItem.earnExchangeRate)
  );

  return {
    stakeItem,
    myDelegate: makeBaker(mockMyDelegateAddress, bakers),
    delegatesLoading,
    endTimestamp: mockLastStaked + Number(stakeItem.timelock) * MS_IN_SECOND,
    myEarnDollarEquivalent,
    stakingLoading,
    handleHarvest
  };
};
