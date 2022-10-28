import { useCallback, useEffect, useMemo, useState } from 'react';

import { ZERO_AMOUNT_BN } from '@config/constants';
import { useFarmingYouvesItemStore } from '@modules/farming/hooks';
import { useRootStore } from '@providers/root-store-provider';
import { useAccountPkh } from '@providers/use-dapp';
import { multipliedIfPossible } from '@shared/helpers';
import { useOnBlock } from '@shared/hooks';

import { getTotalDeposit } from '../../api';

export const useYouvesFarmingItemRewards = () => {
  const { tezos } = useRootStore();
  const accountPkh = useAccountPkh();
  // TODO: remove useState using store
  const [userTotalDeposit, setTotalDeposit] = useState(ZERO_AMOUNT_BN);
  const youvesFarmingItemStore = useFarmingYouvesItemStore();
  const youvesFarmingItem = youvesFarmingItemStore.item;
  const { claimableRewards, longTermRewards } = youvesFarmingItemStore;

  const updateTotalDeposit = useCallback(async () => {
    if (!youvesFarmingItem) {
      setTotalDeposit(ZERO_AMOUNT_BN);

      return;
    }

    const totalDeposit = await getTotalDeposit(tezos, accountPkh, youvesFarmingItem.contractAddress);
    setTotalDeposit(totalDeposit);
  }, [accountPkh, tezos, youvesFarmingItem]);

  useEffect(() => {
    updateTotalDeposit();
  }, [updateTotalDeposit]);

  useOnBlock(updateTotalDeposit);

  const claimablePendingRewardsInUsd = useMemo(() => {
    return multipliedIfPossible(claimableRewards, youvesFarmingItem?.earnExchangeRate);
  }, [claimableRewards, youvesFarmingItem?.earnExchangeRate]);

  const longTermPendingRewardsInUsd = useMemo(() => {
    return multipliedIfPossible(longTermRewards, youvesFarmingItem?.earnExchangeRate);
  }, [longTermRewards, youvesFarmingItem?.earnExchangeRate]);

  const userTotalDepositDollarEquivalent = useMemo(
    () => multipliedIfPossible(userTotalDeposit, youvesFarmingItem?.depositExchangeRate) ?? ZERO_AMOUNT_BN,
    [userTotalDeposit, youvesFarmingItem]
  );

  return {
    claimableRewards,
    claimablePendingRewardsInUsd,
    longTermRewards,
    longTermPendingRewardsInUsd,
    userTotalDeposit,
    userTotalDepositDollarEquivalent
  };
};
