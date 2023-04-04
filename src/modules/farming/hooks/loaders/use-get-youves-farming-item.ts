import { useCallback } from 'react';

import { DELAY_BEFORE_DATA_UPDATE } from '@config/constants';
import { useReady } from '@providers/use-dapp';
import { isExist, sleep } from '@shared/helpers';
import { Optional } from '@shared/types';
import { useToasts } from '@shared/utils';

import { FarmVersion } from '../../interfaces';
import { useFarmingYouvesItemStore } from '../stores';

export const useGetYouvesFarmingItem = () => {
  const { showErrorToast } = useToasts();
  const farmingYouvesItemStore = useFarmingYouvesItemStore();
  const isReady = useReady();

  const getFarmingItem = useCallback(
    async (id: Optional<string>, version: FarmVersion) => {
      let itemStoreWasLoaded = false;
      try {
        if (!isReady || !isExist(id)) {
          return;
        }

        farmingYouvesItemStore.setFarmingId(id);
        farmingYouvesItemStore.setFarmingVersion(version);
        await farmingYouvesItemStore.itemStore.load();
        itemStoreWasLoaded = true;
        await farmingYouvesItemStore.stakesStore.load();
        await farmingYouvesItemStore.contractBalanceStore.load();
        await farmingYouvesItemStore.updatePendingRewards();
      } catch (error) {
        if (itemStoreWasLoaded) {
          showErrorToast(error as Error);
        }
      }
    },
    [isReady, showErrorToast, farmingYouvesItemStore]
  );

  const delayedGetFarmingItem = useCallback(
    async (id: string, version: FarmVersion) => {
      await sleep(DELAY_BEFORE_DATA_UPDATE);
      await getFarmingItem(id, version);
    },
    [getFarmingItem]
  );

  return { getFarmingItem, delayedGetFarmingItem };
};
