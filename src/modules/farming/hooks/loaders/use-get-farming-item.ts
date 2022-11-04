import { useCallback } from 'react';

import BigNumber from 'bignumber.js';

import { DELAY_BEFORE_DATA_UPDATE } from '@config/constants';
import { useReady } from '@providers/use-dapp';
import { sleep } from '@shared/helpers';
import { useToasts } from '@shared/utils';

import { FarmVersion } from '../../interfaces';
// Do not shorty this import
import { useFarmingItemStore } from '../stores/use-farming-item-store';

export const useGetFarmingItem = () => {
  const { showErrorToast } = useToasts();
  const farmingItemStore = useFarmingItemStore();
  const isReady = useReady();

  const getFarmingItem = useCallback(
    async (farmingId: BigNumber, version: FarmVersion, old = true) => {
      if (isReady) {
        try {
          farmingItemStore.setFarmingId(farmingId);
          farmingItemStore.setVersion(version);
          farmingItemStore.setOld(old);
          await farmingItemStore.itemStore.load();
          await Promise.all([
            farmingItemStore.availableBalanceStore.load(),
            farmingItemStore.userInfoStore.load(),
            farmingItemStore.userFarmingDelegateStore.load()
          ]);
          farmingItemStore.updatePendingRewards();
        } catch (error) {
          showErrorToast(error as Error);
        }
      }
    },
    [isReady, showErrorToast, farmingItemStore]
  );

  const delayedGetFarmingItem = useCallback(
    async (farmingId: BigNumber, version: FarmVersion, old = true) => {
      await sleep(DELAY_BEFORE_DATA_UPDATE);

      await getFarmingItem(farmingId, version, old);
    },
    [getFarmingItem]
  );

  return { getFarmingItem, delayedGetFarmingItem };
};
