import { useCallback } from 'react';

import { harvestAllAssets } from '@modules/farming/api';
import { useRootStore } from '@providers/root-store-provider';
import { defined } from '@shared/helpers';
import { amplitudeService } from '@shared/services';
import { useConfirmOperation, useToasts } from '@shared/utils';
import { useTranslation } from '@translation';

import { useFarmingListRewardsStore } from '../stores';
import { useStakedOnlyFarmIds } from '../use-staked-only-farm-ids';

export const useDoHarvestAll = () => {
  const { t } = useTranslation();
  const rootStore = useRootStore();
  const confirmOperation = useConfirmOperation();
  const { showErrorToast } = useToasts();
  const farmingListRewardsStore = useFarmingListRewardsStore();
  const { getStakedOnlyFarmIds } = useStakedOnlyFarmIds();

  const doHarvestAll = useCallback(async () => {
    const stakedOnlyFarmIds = getStakedOnlyFarmIds();
    const logData = {
      harvestAll: {
        farmingIds: stakedOnlyFarmIds,
        rewardsInUsd: Number(farmingListRewardsStore.getUserRewardsLogData(stakedOnlyFarmIds).toFixed())
      }
    };

    try {
      amplitudeService.logEvent('HARVEST_ALL', logData);
      const operation = await harvestAllAssets(
        defined(rootStore.tezos),
        stakedOnlyFarmIds,
        defined(rootStore.authStore.accountPkh)
      );

      await confirmOperation(operation.opHash, { message: t('farm|Stake successful') });
      amplitudeService.logEvent('HARVEST_ALL_SUCCESS', logData);
    } catch (error) {
      showErrorToast(error as Error);
      amplitudeService.logEvent('HARVEST_ALL_FAILED', { ...logData, error });
    }
  }, [
    getStakedOnlyFarmIds,
    farmingListRewardsStore,
    rootStore.tezos,
    rootStore.authStore.accountPkh,
    confirmOperation,
    t,
    showErrorToast
  ]);

  return { doHarvestAll };
};
