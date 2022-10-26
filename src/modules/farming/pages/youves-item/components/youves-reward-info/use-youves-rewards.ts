import { useCallback, useEffect, useMemo, useState } from 'react';

import { ZERO_AMOUNT_BN } from '@config/constants';
import { useFarmingYouvesItemStore } from '@modules/farming/hooks';
import { useRootStore } from '@providers/root-store-provider';
import { useAccountPkh } from '@providers/use-dapp';
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
    return claimableRewards?.times(youvesFarmingItem?.earnExchangeRate ?? ZERO_AMOUNT_BN) ?? null;
  }, [claimableRewards, youvesFarmingItem?.earnExchangeRate]);

  const longTermPendingRewardsInUsd = useMemo(() => {
    return longTermRewards?.times(youvesFarmingItem?.earnExchangeRate ?? ZERO_AMOUNT_BN) ?? null;
  }, [longTermRewards, youvesFarmingItem?.earnExchangeRate]);

  const userTotalDepositDollarEquivalent = useMemo(
    () => userTotalDeposit.times(youvesFarmingItem?.depositExchangeRate ?? ZERO_AMOUNT_BN) ?? null,
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
