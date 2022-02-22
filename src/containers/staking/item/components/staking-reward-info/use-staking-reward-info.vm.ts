import { useMemo } from 'react';

import BigNumber from 'bignumber.js';

import { MS_IN_SECOND } from '@app.config';
import { useStakingItemStore } from '@hooks/stores/use-staking-item-store';
import { useBakers } from '@utils/dapp';
import { bigNumberToString, getDollarEquivalent } from '@utils/helpers';

const mockLastStaked = Date.now();
const DEFAULT_EARN_EXCHANGE_RATE = new BigNumber('0');

export const useStakingRewardInfoViewModel = () => {
  const stakingItemStore = useStakingItemStore();
  const { stakeItem } = stakingItemStore;
  const { data: bakers, loading: bakersLoading } = useBakers();

  // TODO: Remove Copy/past
  const [currentDelegate, nextDelegate, myDelegate] = useMemo(() => {
    if (stakeItem) {
      const { currentDelegate, nextDelegate, myDelegate } = stakeItem;

      return [currentDelegate, nextDelegate, myDelegate].map(
        delegateAddress => bakers.find(({ address }) => address === delegateAddress) ?? null
      );
    }

    return [null, null, null];
  }, [stakeItem, bakers]);

  const delegatesLoading = bakersLoading || !stakeItem;
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
    // TODO: Use it
    currentDelegate,
    nextDelegate
  };
};
