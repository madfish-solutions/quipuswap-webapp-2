import { useCallback, useEffect } from 'react';

import { DEFAULT_TOKEN } from '@config/tokens';
import { useRootStore } from '@providers/root-store-provider';
import { fromDecimals, isNull } from '@shared/helpers';
import { useAuthStore, useOnBlock } from '@shared/hooks';

import { useStableFarmItemStore } from '../../hooks';

export const useStableFarmStakerBalance = () => {
  const { tezos } = useRootStore();
  const { accountPkh } = useAuthStore();
  const stableFarmItemStore = useStableFarmItemStore();

  const { item, poolId, stakerInfoStore, userInfo } = stableFarmItemStore;

  const updateStakerBalance = useCallback(async () => {
    if (isNull(tezos) || isNull(accountPkh) || isNull(item) || isNull(poolId)) {
      return;
    }

    await stakerInfoStore.load();
  }, [accountPkh, item, poolId, stakerInfoStore, tezos]);

  useEffect(() => {
    updateStakerBalance();
  }, [updateStakerBalance]);

  useOnBlock(tezos, updateStakerBalance);

  return userInfo ? fromDecimals(userInfo.yourDeposit, DEFAULT_TOKEN) : null;
};
