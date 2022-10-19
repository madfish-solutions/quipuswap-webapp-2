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
    async (farmingAddress: Optional<string>) => {
      try {
        if (!isReady || !isExist(farmingAddress)) {
          return;
        }

        farmingYouvesItemStore.setFarmingAddress(farmingAddress);
        await farmingYouvesItemStore.itemStore.load();
        await Promise.all([
          farmingYouvesItemStore.availableBalanceStore.load(),
          farmingYouvesItemStore.userInfoStore.load()
        ]);
        farmingYouvesItemStore.updatePendingRewards();
      } catch (error) {
        showErrorToast(error as Error);
        if (isNotFoundError(error as Error)) {
          navigate(`${AppRootRoutes.NotFound}/${farmingAddress}`);
        }
      }
    },
    [isReady, showErrorToast, farmingYouvesItemStore, navigate]
  );

  const delayedGetFarmingItem = useCallback(
    async (farmingAddress: string) => {
      await sleep(DELAY_BEFORE_DATA_UPDATE);
      await getFarmingItem(farmingAddress);
    },
    [getFarmingItem]
  );

  return { getFarmingItem, delayedGetFarmingItem };
};
