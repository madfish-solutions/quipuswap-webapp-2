import { useMemo } from 'react';

import BigNumber from 'bignumber.js';

import { MS_IN_SECOND } from '@app.config';
import { useStakingItemStore } from '@hooks/stores/use-staking-item-store';
import { useBakers, useIsLoading } from '@utils/dapp';
import { bigNumberToString, getDollarEquivalent, isExist } from '@utils/helpers';

const mockLastStaked = Date.now();
const mockMyDelegateAddress = 'tz2XdXvVTgrBzZkBHtDiEWgfrgJXu33rkcJN';
const DEFAULT_EARN_EXCHANGE_RATE = new BigNumber('0');

export const useStakingRewardInfoViewModel = () => {
  const stakingItemStore = useStakingItemStore();
  const { data: bakers, loading: bakersLoading } = useBakers();
  const dAppLoading = useIsLoading();
  const { data: stakeItem, error: stakeItemError } = stakingItemStore.itemStore;
  const stakingLoading = (!stakeItem && !stakeItemError) || dAppLoading;

  // TODO: Remove Copy/past
  const myDelegate = useMemo(() => {
    const myDelegateAddress = mockMyDelegateAddress;

    return isExist(myDelegateAddress)
      ? bakers.find(({ address }) => address === myDelegateAddress) ?? { address: myDelegateAddress }
      : null;
  }, [bakers]);

  const delegatesLoading = bakersLoading || stakingLoading;
  const endTimestamp = stakeItem ? mockLastStaked + Number(stakeItem.timelock) * MS_IN_SECOND : null;

  const myEarnDollarEquivalent = getDollarEquivalent(
    stakeItem?.earnBalance,
    bigNumberToString(stakeItem?.earnExchangeRate ?? DEFAULT_EARN_EXCHANGE_RATE)
  );

  return {
    stakeItem,
    myDelegate,
    delegatesLoading,
    endTimestamp,
    myEarnDollarEquivalent,
    stakingLoading
  };
};
