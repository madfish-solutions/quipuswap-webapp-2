import { useMemo } from 'react';

import BigNumber from 'bignumber.js';

import { MS_IN_SECOND } from '@app.config';
import { useStakingItemStore } from '@hooks/stores/use-staking-item-store';
import { useBakers, useIsLoading } from '@utils/dapp';
import { bigNumberToString, getDollarEquivalent, isExist } from '@utils/helpers';

const mockLastStaked = Date.now();
const DEFAULT_EARN_EXCHANGE_RATE = new BigNumber('0');

export const useStakingRewardInfoViewModel = () => {
  const stakingItemStore = useStakingItemStore();
  const { stakeItem } = stakingItemStore;
  const { data: bakers, loading: bakersLoading } = useBakers();
  const dAppLoading = useIsLoading();
  const stakingLoading = (!stakingItemStore.stakeItem && !stakingItemStore.error) || dAppLoading;

  // TODO: Remove Copy/past
  const myDelegate = useMemo(() => {
    const myDelegateAddress = stakeItem?.myDelegate;

    return isExist(myDelegateAddress)
      ? bakers.find(({ address }) => address === myDelegateAddress) ?? { address: myDelegateAddress }
      : null;
  }, [stakeItem, bakers]);

  const delegatesLoading = bakersLoading || stakingLoading;
  const endTimestamp = stakeItem ? mockLastStaked + stakeItem.timelock * MS_IN_SECOND : null;

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
