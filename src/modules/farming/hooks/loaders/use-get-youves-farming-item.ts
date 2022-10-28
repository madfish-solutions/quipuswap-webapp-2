import { useCallback } from 'react';

import { useNavigate } from 'react-router-dom';

import { AppRootRoutes } from '@app.router';
import { DELAY_BEFORE_DATA_UPDATE } from '@config/constants';
import { useReady } from '@providers/use-dapp';
import { isExist, isNotFoundError, sleep } from '@shared/helpers';
import { Optional } from '@shared/types';
import { useToasts } from '@shared/utils';

import { useFarmingYouvesItemStore } from '../stores';

export const useGetYouvesFarmingItem = () => {
  const { showErrorToast } = useToasts();
  const farmingYouvesItemStore = useFarmingYouvesItemStore();
  const isReady = useReady();
  const navigate = useNavigate();

  const getFarmingItem = useCallback(
    async (id: Optional<string>) => {
      try {
        if (!isReady || !isExist(id)) {
          return;
        }

        farmingYouvesItemStore.setFarmingId(id);
        await farmingYouvesItemStore.itemStore.load();
        await farmingYouvesItemStore.stakesStore.load();
        await farmingYouvesItemStore.contractBalanceStore.load();
        farmingYouvesItemStore.updatePendingRewards();
      } catch (error) {
        showErrorToast(error as Error);
        if (isNotFoundError(error as Error)) {
          navigate(`${AppRootRoutes.NotFound}/${id}`);
        }
      }
    },
    [isReady, showErrorToast, farmingYouvesItemStore, navigate]
  );

  const delayedGetFarmingItem = useCallback(
    async (id: string) => {
      await sleep(DELAY_BEFORE_DATA_UPDATE);
      await getFarmingItem(id);
    },
    [getFarmingItem]
  );

  return { getFarmingItem, delayedGetFarmingItem };
};
