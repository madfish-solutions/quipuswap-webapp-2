import { useCallback, useEffect } from 'react';

import { useRootStore } from '@providers/root-store-provider';
import { isNull } from '@shared/helpers';
import { useAuthStore, useOnBlock } from '@shared/hooks';

import { useStableDividendsItemStore } from '../../hooks';

export const useRealStableDividendsStakerBalance = () => {
  const { tezos } = useRootStore();
  const { accountPkh } = useAuthStore();
  const stableDividendsItemStore = useStableDividendsItemStore();

  const { item, poolId, stakerInfoStore, userInfo } = stableDividendsItemStore;

  const updateStakerBalance = useCallback(async () => {
    if (isNull(tezos) || isNull(accountPkh) || isNull(item) || isNull(poolId)) {
      return;
    }

    await stakerInfoStore.load();
  }, [accountPkh, item, poolId, stakerInfoStore, tezos]);

  useEffect(() => {
    updateStakerBalance();
  }, [updateStakerBalance]);

  useOnBlock(updateStakerBalance);

  return userInfo?.yourDeposit ?? null;
};
